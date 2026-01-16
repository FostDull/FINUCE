from fastapi import APIRouter, Depends
from app.deps.auth import get_current_user

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/secure")
def secure_health(user=Depends(get_current_user)):
    return {
        "status": "ok",
        "user_id": user["sub"],
        "email": user.get("email"),
    }
