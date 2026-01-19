import os
import requests
from jose import jwt, JWTError
from functools import lru_cache

SUPABASE_PROJECT_URL = os.getenv("SUPABASE_PROJECT_URL")
SUPABASE_JWT_AUDIENCE = os.getenv("SUPABASE_JWT_AUDIENCE", "authenticated")

ISSUER = f"{SUPABASE_PROJECT_URL}/auth/v1"
JWKS_URL = f"{ISSUER}/.well-known/jwks.json"


@lru_cache()
def get_jwks():
    response = requests.get(JWKS_URL)
    response.raise_for_status()
    return response.json()


def verify_jwt(token: str):
    try:
        jwks = get_jwks()

        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience=SUPABASE_JWT_AUDIENCE,
            issuer=ISSUER,
        )

        return payload  # contiene sub, email, role, etc

    except JWTError as e:
        print("JWT error:", e)
        return None
