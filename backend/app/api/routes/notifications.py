from fastapi import APIRouter
from app.core.mongo import notifications_collection

router = APIRouter()


@router.get("/notifications/{user_id}")
def get_notifications(user_id: str):
    notifications = list(
        notifications_collection.find(
            {"user_id": user_id},
            {"_id": 0}
        )
    )
    return notifications
