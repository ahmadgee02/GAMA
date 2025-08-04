from pymongo import MongoClient
from .config import settings

client = MongoClient(settings.DATABASE_URL)
db = client["user_db"]
user_collection = db["users"]
incontext_example_collection = db["incontext_examples"]
stratergy_collection = db["stratergies"]
prompt_collection = db["prompts"]
agent_collection = db["agents"]