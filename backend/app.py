from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Firebase
cred = credentials.Certificate('./serviceAccountKey.json')  # You'll need to add your Firebase credentials file
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/map/config', methods=['GET'])
def get_map_config():
    # Get user location from query parameters if available
    lat = request.args.get('lat', 40.7128)  # Default to NYC if not provided
    lng = request.args.get('lng', -74.0060)
    
    try:
        lat = float(lat)
        lng = float(lng)
    except ValueError:
        lat = 40.7128
        lng = -74.0060
    
    # Get location name using reverse geocoding
    location_name = get_location_name(lat, lng)
    print(f"Location coordinates: {lat}, {lng}")
    print(f"Resolved location name: {location_name}")
    
    return jsonify({
        'tileServer': 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        'initialRegion': {
            'latitude': lat,
            'longitude': lng,
            'latitudeDelta': 0.0922,
            'longitudeDelta': 0.0421,
        },
        'locationName': location_name
    })

def get_location_name(lat, lng):
    try:
        # Use Nominatim API for reverse geocoding (OpenStreetMap's geocoding service)
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}&zoom=18&addressdetails=1"
        headers = {
            'User-Agent': 'DisasterApp/1.0'  # Required by Nominatim's terms of use
        }
        response = requests.get(url, headers=headers)
        data = response.json()
        
        # Extract location name
        if 'address' in data:
            address = data['address']
            # Try to get city or town name
            if 'city' in address:
                return address['city']
            elif 'town' in address:
                return address['town']
            elif 'village' in address:
                return address['village']
            elif 'suburb' in address:
                return address['suburb']
            elif 'county' in address:
                return address['county']
            elif 'state' in address:
                return address['state']
        
        # If we can't get a specific part, use the display name
        if 'display_name' in data:
            parts = data['display_name'].split(',')
            return parts[0].strip()
            
        return "Unknown Location"
    except Exception as e:
        print(f"Error in reverse geocoding: {e}")
        return "Unknown Location"

@app.route('/disaster-tweets', methods=['POST'])
def add_disaster_tweet():
    """
    Endpoint to add a new disaster tweet
    Expected JSON payload:
    {
        'text': 'Tweet text',
        'author': 'Twitter handle',
        'created_at': 'Tweet creation timestamp',
        'disaster_confidence': 0.75
    }
    """
    tweet_data = request.json

    # Validate input
    required_fields = ['text', 'author', 'created_at', 'disaster_confidence']
    if not all(field in tweet_data for field in required_fields):
        logging.warning(f"Incomplete tweet data: {tweet_data}")
        return jsonify({
            "status": "error", 
            "message": "Missing required fields"
        }), 400

    try:
        # Parse created_at timestamp
        parsed_created_at = datetime.fromisoformat(tweet_data['created_at'])
        
        # Add to Firestore
        tweets_ref = db.collection('tweets')
        tweets_ref.add({
            'text': tweet_data['text'],
            'author': tweet_data['author'],
            'created_at': parsed_created_at,
            'disaster_confidence': tweet_data['disaster_confidence'],
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        
        logging.info(f"Tweet added from {tweet_data['author']} with confidence {tweet_data['disaster_confidence']}")
        return jsonify({"status": "success", "message": "Tweet added"}), 201
    
    except ValueError as ve:
        logging.error(f"Invalid timestamp format: {ve}")
        return jsonify({
            "status": "error", 
            "message": f"Invalid timestamp format: {str(ve)}"
        }), 400
    except Exception as e:
        logging.error(f"Database error: {e}")
        return jsonify({
            "status": "error", 
            "message": f"Database error: {str(e)}"
        }), 500

@app.route('/disaster-tweets', methods=['GET'])
def get_disaster_tweets():
    """
    Retrieve recent disaster tweets (last 24 hours)
    Optional query parameters:
    - limit: Number of tweets to return (default 10)
    - min_confidence: Minimum disaster confidence score (default 0.5)
    """
    # Get query parameters
    limit = request.args.get('limit', default=10, type=int)
    min_confidence = request.args.get('min_confidence', default=0.5, type=float)
    
    # Calculate 24 hours ago
    twenty_four_hours_ago = datetime.now() - timedelta(hours=24)
    
    try:
        # Query Firestore
        tweets_ref = db.collection('tweets')
        query = (tweets_ref
                .where('created_at', '>=', twenty_four_hours_ago)
                .where('disaster_confidence', '>=', min_confidence)
                .order_by('disaster_confidence', direction=firestore.Query.DESCENDING)
                .limit(limit))
        
        docs = query.stream()
        
        # Convert to JSON serializable format
        tweet_list = []
        for doc in docs:
            tweet_data = doc.to_dict()
            tweet_list.append({
                'text': tweet_data['text'],
                'author': tweet_data['author'],
                'created_at': tweet_data['created_at'].isoformat(),
                'disaster_confidence': tweet_data['disaster_confidence']
            })
        
        logging.info(f"Retrieved {len(tweet_list)} disaster tweets")
        return jsonify(tweet_list)
    
    except Exception as e:
        logging.error(f"Database error: {e}")
        return jsonify({
            "status": "error", 
            "message": f"Database error: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5700) 