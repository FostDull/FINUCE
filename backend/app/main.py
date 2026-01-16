from fastapi import FastAPI
from app.api.routes import health

app = FastAPI(
    title="FinUCE Backend",
    version="1.0.0",
)

app.include_router(health.router)


@app.get("/")
def root():
    return {"message": "FinUCE API running"}


@app.post("/login")
def login():
    return {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "token_type": "bearer"
    }
