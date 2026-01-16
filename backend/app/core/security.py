from jose import jwt, JWTError
from app.core.config import settings


def verify_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            audience="authenticated"
        )
        return payload
    except JWTError:
        return None
