import os
import redis
import logging

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    logger.warning("REDIS_URL no definido, Redis deshabilitado")
    redis_client = None
else:
    redis_client = redis.Redis.from_url(REDIS_URL)
