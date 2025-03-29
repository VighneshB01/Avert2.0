import tweepy
import time
import requests
import re
import logging
from datetime import datetime, timedelta
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv()

# Get configuration from environment variables
FLASK_SERVER_URL = os.getenv('FLASK_SERVER_URL', 'http://localhost:5700')

# Initialize Firebase
try:
    cred = credentials.Certificate('../backend/serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    logging.error(f"Firebase initialization error: {e}")

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class DisasterTweetAggregator:
    def __init__(self, bearer_token, flask_server_url):
        # Twitter API Authentication using V2 Client
        try:
            self.client = tweepy.Client(bearer_token=bearer_token)
            
            # Flask server URL for sending processed tweets
            self.flask_server_url = flask_server_url
            
            # Initialize NLTK
            try:
                nltk.data.find('tokenizers/punkt')
                nltk.data.find('corpora/stopwords')
            except LookupError:
                logging.info("Downloading required NLTK data...")
                nltk.download('punkt')
                nltk.download('stopwords')
            
            # Load spaCy model
            try:
                self.nlp = spacy.load('en_core_web_sm')
            except OSError:
                logging.error("SpaCy model 'en_core_web_sm' not found. Installing...")
                spacy.cli.download("en_core_web_sm")
                self.nlp = spacy.load('en_core_web_sm')
            
            # Disaster-related keywords and phrases
            self.disaster_keywords = [
                'earthquake', 'tsunami', 'hurricane', 'tornado', 
                'flood', 'wildfire', 'evacuation', 'emergency', 
                'disaster', 'rescue', 'crisis', 'alert', 
                'severe weather', 'warning', 'landslide', 
                'storm', 'cyclone', 'typhoon'
            ]
            
            # Track last search time to respect rate limits
            self.last_search_time = datetime.now() - timedelta(minutes=5)
            
            # Track rate limited handles
            self.rate_limited_handles = {}
        except Exception as e:
            logging.error(f"Authentication failed: {e}")
            raise

    def preprocess_tweet(self, tweet_text):
        # Convert to lowercase
        tweet_text = tweet_text.lower()
        
        # Remove URLs
        tweet_text = re.sub(r'http\S+', '', tweet_text)
        
        # Remove special characters and numbers
        tweet_text = re.sub(r'[^a-zA-Z\s]', '', tweet_text)
        
        return tweet_text
    
    def detect_disaster_context(self, tweet_text):
        # Tokenize the tweet
        tokens = word_tokenize(tweet_text)
        
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        tokens = [token for token in tokens if token not in stop_words]
        
        # Use spaCy for named entity recognition
        doc = self.nlp(tweet_text)
        
        # Check for location entities and disaster keywords
        location_entities = [ent.text for ent in doc.ents if ent.label_ in ['GPE', 'LOC']]
        
        # Calculate disaster context score
        keyword_matches = sum(1 for keyword in self.disaster_keywords if keyword in tokens)
        location_score = len(location_entities) * 0.5
        
        # Confidence score calculation
        confidence = (keyword_matches * 0.6) + (location_score * 0.4)
        
        return confidence > 0.5, min(confidence, 1.0)

    def search_recent_tweets(self, handles, max_tweets=10):
        """
        Search for the most recent disaster-related tweet from specified handles
        """
        # Respect rate limits (once every 5 minutes)
        current_time = datetime.now()
        time_since_last_search = current_time - self.last_search_time
        
        if time_since_last_search.total_seconds() < 300:
            wait_time = 300 - time_since_last_search.total_seconds()
            logging.info(f"Waiting {wait_time} seconds to respect rate limits")
            time.sleep(wait_time)
        
        all_tweets = []
        
        # Check which handles are available (not rate limited)
        available_handles = []
        for handle in handles:
            if handle in self.rate_limited_handles:
                # Check if enough time has passed since rate limit
                limit_time = self.rate_limited_handles[handle]
                if current_time < limit_time:
                    time_to_wait = (limit_time - current_time).total_seconds()
                    logging.info(f"Handle {handle} is rate limited for {time_to_wait:.1f} more seconds")
                    continue
                else:
                    # Rate limit has expired
                    del self.rate_limited_handles[handle]
                    available_handles.append(handle)
            else:
                available_handles.append(handle)
        
        if not available_handles:
            logging.warning("All handles are rate limited. Waiting before retry.")
            return all_tweets
        
        # Shuffle the handles to distribute requests
        import random
        random.shuffle(available_handles)
        
        for handle in available_handles:
            try:
                # Get user ID first
                user_response = self.client.get_user(username=handle)
                if not user_response.data:
                    logging.warning(f"Could not find user: {handle}")
                    continue
                
                user_id = user_response.data.id
                
                # Construct query with user and disaster keywords
                query = f'from:{handle} ({" OR ".join(self.disaster_keywords)})'
                
                # Search recent tweets
                tweets_response = self.client.search_recent_tweets(
                    query=query, 
                    max_results=max_tweets,
                    tweet_fields=['created_at', 'text']
                )
                
                if tweets_response.data:
                    for tweet in tweets_response.data:
                        # Preprocess tweet
                        processed_tweet = self.preprocess_tweet(tweet.text)
                        
                        # Detect disaster context
                        is_disaster, confidence = self.detect_disaster_context(processed_tweet)
                        
                        if is_disaster:
                            tweet_data = {
                                'text': tweet.text,
                                'author': handle,
                                'created_at': str(tweet.created_at),
                                'disaster_confidence': confidence
                            }
                            
                            # Send to Flask server
                            try:
                                response = requests.post(
                                    self.flask_server_url + '/disaster-tweets', 
                                    json=tweet_data
                                )
                                logging.info(f"Tweet sent. Status: {response.status_code}")
                                all_tweets.append(tweet_data)
                                
                                # Return after finding one disaster tweet
                                return all_tweets
                            except requests.exceptions.RequestException as e:
                                logging.error(f"Error sending tweet: {e}")
            
            except tweepy.TooManyRequests:
                logging.warning(f"Rate limit reached for {handle}")
                # Set rate limit for this handle to expire in 15 minutes
                self.rate_limited_handles[handle] = current_time + timedelta(minutes=15)
                continue
            except Exception as e:
                logging.error(f"Error processing tweets for {handle}: {e}")
        
        # Update last search time
        self.last_search_time = datetime.now()
        
        return all_tweets

    def get_latest_tweet_from_server(self):
        """
        Retrieve only the latest tweet from the Flask server
        """
        try:
            response = requests.get(
                f"{self.flask_server_url}/disaster-tweets?limit=1",
                timeout=5  # Add timeout
            )
            if response.status_code == 200:
                tweets = response.json()
                if tweets:
                    logging.info(f"Retrieved latest tweet from server")
                    return tweets[0]
                else:
                    logging.info("No tweets found on server")
                    return None
            else:
                logging.error(f"Error retrieving tweets: {response.status_code}")
                return None
        except requests.exceptions.ConnectionError:
            logging.error(f"Could not connect to Flask server at {self.flask_server_url}. Is it running?")
            return None
        except requests.exceptions.RequestException as e:
            logging.error(f"Connection error to server: {e}")
            return None

# Main execution
if __name__ == "__main__":
    # IMPORTANT: Replace these with your actual credentials
    BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAEfm0AEAAAAASQpA0KutzBLA%2FbE8KtT52N1N3tI%3DseS6iemOd5nziqU3GDXFqvg7Cvz9xAxGZGzj0vsxLq3Au9NkOQ'
    
    
    
    # Expanded list of Twitter handles to track
    TRACK_HANDLES = [
        'Redcross',  
           # Original handle
        
    ]

    # Initialize the aggregator
    disaster_aggregator = DisasterTweetAggregator(
        BEARER_TOKEN,
        FLASK_SERVER_URL
    )
    
    # Search for disaster-related tweets
    retry_count = 0
    while True:
        try:
            disaster_tweets = disaster_aggregator.search_recent_tweets(TRACK_HANDLES)
            logging.info(f"Found {len(disaster_tweets)} disaster-related tweets")
            
            if not disaster_tweets:
                # If no new tweets found, get the latest one from the server instead
                latest_tweet = disaster_aggregator.get_latest_tweet_from_server()
                if latest_tweet:
                    logging.info(f"Retrieved latest tweet from server by {latest_tweet['author']}")
                
                # Increase retry count and wait time if no tweets are found
                retry_count += 1
                wait_time = min(300 * (1.5 ** min(retry_count, 5)), 1800)  # Cap at 30 minutes
                logging.info(f"No new tweets found. Waiting {wait_time:.1f} seconds before retry #{retry_count}")
            else:
                # Reset retry count if a tweet was found
                retry_count = 0
                wait_time = 900  # 15 minutes between successful searches
                logging.info(f"Tweet found. Next search in {wait_time} seconds")
            
            # Wait before next search
            time.sleep(wait_time)
        except Exception as e:
            logging.error(f"An error occurred: {e}")
            # Exponential backoff on errors
            retry_count += 1
            wait_time = min(300 * (2 ** min(retry_count, 4)), 3600)  # Cap at 1 hour
            logging.info(f"Error occurred. Waiting {wait_time} seconds before retry #{retry_count}")
            time.sleep(wait_time)