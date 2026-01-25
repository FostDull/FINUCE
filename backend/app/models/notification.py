from datetime import datetime


def notification_schema(user_id: str, title: str, message: str):
    return {
        "user_id": user_id,
        "title": title,
        "message": message,
        "read": False,
        "created_at": datetime.utcnow()
    }
