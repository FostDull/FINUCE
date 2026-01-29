from fastapi import Header, HTTPException
from jose import jwt
from jose.utils import base64url_decode
from jose.backends.rsa_backend import RSAKey
import requests
from functools import lru_cache

SUPABASE_URL = "https://yoeskxgikvspffmmkhds.supabase.co"
ALGORITHMS = ["RS256"]
AUDIENCE = "authenticated"
ISSUER = f"{SUPABASE_URL}/auth/v1"


@lru_cache()
def get_jwks():
    res = requests.get(f"{SUPABASE_URL}/auth/v1/keys")
    res.raise_for_status()
    return res.json()


def build_rsa_key(jwk: dict):
    return RSAKey(
        {
            "kty": jwk["kty"],
            "kid": jwk["kid"],
            "use": jwk["use"],
            "n": jwk["n"],
            "e": jwk["e"],
        },
        algorithm="RS256",
    )


def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing Authorization header")

    token = authorization.replace("Bearer ", "")

    try:
        header = jwt.get_unverified_header(token)
        kid = header["kid"]

        jwks = get_jwks()
        jwk = next(k for k in jwks["keys"] if k["kid"] == kid)

        rsa_key = build_rsa_key(jwk)

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=AUDIENCE,
            issuer=ISSUER,
        )

        return payload

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
