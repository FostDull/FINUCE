from app.core.redis import redis_client

PREFIX = "payment_notified:"


def already_notified(payment_id: str) -> bool:
    return redis_client.exists(f"{PREFIX}{payment_id}") == 1


def mark_as_notified(payment_id: str):
    redis_client.set(f"{PREFIX}{payment_id}", "1", ex=60 * 60 * 24)
