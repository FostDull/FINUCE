from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountResponse

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.post("/", response_model=AccountResponse)
def create_account(data: AccountCreate, db: Session = Depends(get_db)):
    account = Account(name=data.name)
    db.add(account)
    db.commit()
    db.refresh(account)
    return account
