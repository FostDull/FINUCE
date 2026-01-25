from app.core.mongo import notifications_collection
from app.models.notification import notification_schema


def create_notification(user_id: str, title: str, message: str):
    notification = notification_schema(user_id, title, message)
    notifications_collection.insert_one(notification)
