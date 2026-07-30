import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    DATABASE_URL: str = "sqlite:///./insurance_risk.db"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "test-key")

settings = Settings()
