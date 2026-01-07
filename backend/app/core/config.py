"""
Application configuration using Pydantic Settings.
Loads environment variables from .env file.
"""
import secrets
from typing import List, Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # ==========================================
    # PROJECT SETTINGS
    # ==========================================
    PROJECT_NAME: str = "CollabSphere"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    
    # ==========================================
    # DATABASE
    # ==========================================
    DATABASE_URL: str = "postgresql+asyncpg://collabsphere:collabsphere_password@db:5432/collabsphere_db"
    
    # ==========================================
    # REDIS
    # ==========================================
    REDIS_URL: str = "redis://redis:6379/0"
    
    # ==========================================
    # SECURITY / JWT
    # ==========================================
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # ==========================================
    # CORS
    # ==========================================
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            # Remove brackets and quotes, then split
            v = v.strip("[]'\"")
            return [i.strip().strip("'\"") for i in v.split(",") if i.strip()]
        return v
    
    # ==========================================
    # EMAIL (SMTP) - Optional
    # ==========================================
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None
    
    # ==========================================
    # CLOUDINARY - Optional
    # ==========================================
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    # ==========================================
    # AI INTEGRATION
    # ==========================================
    GEMINI_API_KEY: Optional[str] = None
    GOOGLE_GEMINI_API_KEY: Optional[str] = None  # Alias
    
    # ==========================================
    # LOGGING & SECURITY
    # ==========================================
    LOG_LEVEL: str = "INFO"
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def assemble_allowed_hosts(cls, v):
        """Parse allowed hosts from string or list."""
        if isinstance(v, str):
            v = v.strip("[]'\"")
            return [i.strip().strip("'\"") for i in v.split(",") if i.strip()]
        return v
    
    # ==========================================
    # PYDANTIC CONFIG
    # ==========================================
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,  # Allow lowercase env vars
        extra="ignore",  # Ignore extra fields from .env
    )


# Create global settings instance
settings = Settings()