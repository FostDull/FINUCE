import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError("Supabase env vars no definidas")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_supabase_client():
    return supabase
