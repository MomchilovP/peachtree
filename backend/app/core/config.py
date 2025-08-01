from typing import List


class Settings:
    PROJECT_NAME: str = "PeachTree Bank Transaction API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite:///./peachtree_bank.db"

    # Security
    SECRET_KEY: str = "super-secret-key-that-should-be-in-env-file-but-is-not-for-this-mvp"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS - Frontend URLs
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


settings = Settings()
