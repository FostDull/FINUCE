from app.core.redis import redis_client
from app.core.mongo import mongo_db
from fastapi import FastAPI
import logging

from app.core.database import Base, engine
from app.api.routes import accounts, transactions, payments, webhooks, notifications

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FIN-UCE API",
    version="1.0.0",
    description="Backend bancario con FastAPI, Supabase y Stripe"
)


@app.on_event("startup")
def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Tablas creadas exitosamente o ya existentes.")
    except Exception as e:
        logger.error(f"Error conectando a la base de datos: {e}")
        raise


# Rutas
app.include_router(accounts.router)
# app.include_router(transactions.router)
app.include_router(payments.router)
app.include_router(webhooks.router)
# app.include_router(notifications.router)


@app.get("/", tags=["General"])
def root():
    return {
        "status": "ok",
        "service": "payments-api",
        "documentation": "/docs"
    }


@app.get("/health", tags=["General"])
def health():
    return {"status": "healthy"}


print(mongo_db.list_collection_names())

redis_client.ping()
