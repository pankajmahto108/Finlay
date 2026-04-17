"""
Centralized configuration loader for Finlay Backend.
All environment variables are accessed through this module.
No other module should call os.getenv() directly.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # --- LLM Provider ---
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama3-8b-8192")

    # --- Hindsight Memory ---
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")
    HINDSIGHT_PROJECT_ID: str = os.getenv("HINDSIGHT_PROJECT_ID", "finlay-qbit")

    # --- Server ---
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    ALLOWED_ORIGINS: list = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

    # --- App ---
    APP_ENV: str = os.getenv("APP_ENV", "development")

    @classmethod
    def is_production(cls) -> bool:
        return cls.APP_ENV == "production"

    @classmethod
    def validate(cls):
        """Warn about missing critical keys at startup."""
        warnings = []
        if not cls.GROQ_API_KEY or cls.GROQ_API_KEY == "your_groq_api_key_here":
            warnings.append("GROQ_API_KEY is missing — LLM calls will use mock mode.")
        if not cls.HINDSIGHT_API_KEY:
            warnings.append("HINDSIGHT_API_KEY is missing — memory will use local fallback.")
        for w in warnings:
            print(f"  ⚠  [Config] {w}")
        if not warnings:
            print("  ✓  [Config] All keys loaded successfully.")


settings = Settings()
