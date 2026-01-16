import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    SUPABASE_PROJECT_URL: str = os.getenv("SUPABASE_PROJECT_URL")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"


settings = Settings()
