import requests
from jose import jwt
from jose.exceptions import JWTError
from fastapi import Header, HTTPException

SUPABASE_URL = "https://yoeskxgikvspfmmkhds.supabase.co"
JWKS_URL = f"{SUPABASE_URL}/auth/v1/keys"
AUDIENCE = "authenticated"
ISSUER = f"{SUPABASE_URL}/auth/v1"

_jwks_cache = None


def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        try:
            response = requests.get(JWKS_URL, timeout=5)
            response.raise_for_status()
            _jwks_cache = response.json()
        except Exception:
            raise HTTPException(
                status_code=503,
                detail="Auth service unavailable"
            )
    return _jwks_cache


def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization")

    token = authorization.replace("Bearer ", "")

    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        if not kid:
            raise HTTPException(status_code=401, detail="Invalid token header")

        jwks = get_jwks()
        key = next(k for k in jwks["keys"] if k["kid"] == kid)

        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            audience=AUDIENCE,
            issuer=ISSUER,
        )

        return payload

    except StopIteration:
        raise HTTPException(status_code=401, detail="Invalid token key")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
