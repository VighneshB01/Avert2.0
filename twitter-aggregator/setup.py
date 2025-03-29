import nltk
import spacy

def setup():
    # Download required NLTK data
    nltk.download('punkt')
    nltk.download('stopwords')
    
    # Download spaCy model
    spacy.cli.download("en_core_web_sm")

if __name__ == "__main__":
    setup() 