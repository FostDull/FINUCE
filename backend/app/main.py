from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.redis import redis_client
from app.core.mongo import mongo_db

# ✅ IMPORTA SOLO LOS ROUTERS QUE FUNCIONAN
from app.api.routes import accounts, payments
# from app.api.routes import transactions
# from app.api.routes import webhooks
from app.api.routes import notifications

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FIN-UCE API",
    version="1.0.0",
    description="Backend bancario con FastAPI, Supabase y Stripe"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔁 Startup


@app.on_event("startup")
def startup_checks():
    try:
        mongo_db.list_collection_names()
        logger.info("Mongo conectado correctamente")
    except Exception as e:
        logger.warning(f"Mongo no disponible en startup: {e}")

    try:
        redis_client.ping()
        logger.info("Redis conectado correctamente")
    except Exception as e:
        logger.warning(f"Redis no disponible en startup: {e}")


# Rutas activas
app.include_router(accounts.router)
app.include_router(payments.router)


@app.get("/", tags=["General"])
def root():
    return {
        "status": "ok",
        "service": "fin-uce-backend",
        "documentation": "/docs"
    }


@app.get("/health", tags=["General"])
def health():
    return {"status": "healthy"}
