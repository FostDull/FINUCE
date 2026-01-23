from fastapi import FastAPI

from app.core.database import Base, engine
from app.api.routes import accounts, transactions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FIN-UCE API")

app.include_router(accounts.router)
app.include_router(transactions.router)
