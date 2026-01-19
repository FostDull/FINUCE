from fastapi import FastAPI
from app.api.routes import accounts
from app.api.routes import transactions

app = FastAPI(
    title="FinUCE Backend",
    version="1.0.0"
)

# 🔹 Registrar rutas
app.include_router(accounts.router)
app.include_router(transactions.router)


@app.get("/")
def root():
    return {"message": "FinUCE API running"}
