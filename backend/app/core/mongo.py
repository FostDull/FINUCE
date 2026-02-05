import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise RuntimeError("MONGO_URL no está definido")

client = MongoClient(MONGO_URL)

mongo_db = client["fin_uce"]

# 🔔 Notificaciones
notifications_collection = mongo_db["notifications"]

# 💳 Pagos (estado inicial y actualizado por webhook)
payments_collection = mongo_db["pending_payments"]

# 🛒 Productos Stripe (LO QUE FALTABA)
products_collection = mongo_db["products"]
