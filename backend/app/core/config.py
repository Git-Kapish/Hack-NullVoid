from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "ShopSmart AI"
    APP_ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/shopsmart_db"
    TEST_DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/shopsmart_test_db"

    # Security & JWT
    JWT_SECRET: str = "shopsmart-hackathon-super-secret-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    JWT_ISSUER: str = "shopsmart-api"
    JWT_AUDIENCE: str = "shopsmart-web"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # AI & Embeddings
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "text-embedding-004"
    EMBED_DIM: int = 768
    USE_FAKE_LLM: bool = True

    # Server & CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
