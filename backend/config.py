import os
from dotenv import load_dotenv

load_dotenv()

class Config():
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///database/local_database.db"
    API_BASE_URL = os.environ.get("API_BASE_URL", "http://192.168.1.60:5001")
