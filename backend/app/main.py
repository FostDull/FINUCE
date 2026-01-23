from fastapi import FastAPI
import logging

from app.core.database import Base, engine
from app.api.routes import accounts, transactions

# Configuración de logs para ver errores en consola fácilmente
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_tables():
    try:
        # Esto crea las tablas en Postgres si no existen
        Base.metadata.create_all(bind=engine)
        logger.info("Tablas creadas exitosamente o ya existentes.")
    except Exception as e:
        logger.error(f"Error conectando a la base de datos: {e}")


app = FastAPI(
    title="FIN-UCE API",
    version="1.0.0",
    description="Backend bancario con FastAPI, Supabase y MongoDB"
)

# Ejecutar creación de tablas al iniciar
create_tables()

# Registro de rutas con prefijo para evitar el 404 y organizar mejor
# Ahora tus rutas serán /accounts/ y /transactions/
app.include_router(accounts.router)
app.include_router(transactions.router)


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
