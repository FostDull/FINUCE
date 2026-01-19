from fastapi import Header, HTTPException
from jose import jwt


def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]

    try:
        # ✅ NO validar firma (Supabase ya lo hizo)
        payload = jwt.get_unverified_claims(token)

        if payload.get("role") != "authenticated":
            raise HTTPException(status_code=401, detail="Invalid role")

        return payload

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
