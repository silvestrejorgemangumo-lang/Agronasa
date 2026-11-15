import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///agrosmart_dev.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    NASA_POWER_BASE_URL = os.getenv("NASA_POWER_BASE_URL", "https://power.larc.nasa.gov/api/temporal/daily/point")
    NASA_TIMEOUT = int(os.getenv("NASA_TIMEOUT", "15"))
    CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "21600"))
    DEBUG = os.getenv("FLASK_ENV") == "development"
