from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.account import Account

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"]
)


@router.get("/")
def get_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    return accounts
