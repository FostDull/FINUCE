from fastapi import FastAPI
from app.api.routes import accounts, transactions, auth

app = FastAPI(
    title="FinUCE Backend",
    version="1.0.0"
)

# 👇 prefijo global /api
app.include_router(auth.router, prefix="/api")
app.include_router(accounts.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "FinUCE API running"}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return {}
