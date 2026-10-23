from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "ShopSmart AI Backend"
    APP_ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/shopsmart_db"

    # Clerk Authentication
    CLERK_SECRET_KEY: Optional[str] = None
    CLERK_PUBLISHABLE_KEY: Optional[str] = None
    CLERK_JWKS_URL: Optional[str] = None
    CLERK_MOCK_AUTH: bool = True  # Allows header/mock token development when external Clerk key not set

    # Inngest Background Workflows
    INNGEST_APP_ID: str = "shopsmart-backend"
    INNGEST_EVENT_KEY: Optional[str] = None
    INNGEST_SIGNING_KEY: Optional[str] = None
    INNGEST_IS_DEV: bool = True

    # Generative AI (Gemini API) & RAG Configuration
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.5-flash"
    EMBEDDING_MODEL: str = "gemini-embedding-001"
    EMBED_DIM: int = 768
    USE_FAKE_LLM: bool = False
    RAG_SIMILARITY_THRESHOLD_HIGH: float = 0.40
    RAG_SIMILARITY_THRESHOLD_MED: float = 0.25
    RAG_TOP_K: int = 5
    RAG_MAX_UPLOAD_SIZE_BYTES: int = 2 * 1024 * 1024  # 2MB limit

    # Server & CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
