import tweepy

bearer_token = 'AAAAAAAAAAAAAAAAAAAAAEfm0AEAAAAASQpA0KutzBLA%2FbE8KtT52N1N3tI%3DseS6iemOd5nziqU3GDXFqvg7Cvz9xAxGZGzj0vsxLq3Au9NkOQ'
client = tweepy.Client(bearer_token=bearer_token)

try:
    user = client.get_user(username='RedCross')
    print(f"Full user object: {user}")  # Print the entire response
    if user and user.data:
        print(f"Successfully authenticated and fetched user: {user.data.username}")
    else:
        print("Error: Could not retrieve user data.")
except tweepy.TweepyException as e:
    print(f"Authentication error: {e}")