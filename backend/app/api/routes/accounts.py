from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountResponse

router = APIRouter(
    prefix="/api/accounts",
    tags=["Accounts"]
)


@router.get("/", response_model=list[AccountResponse])
def get_accounts(db: Session = Depends(get_db)):
    return db.query(Account).all()


@router.post("/", response_model=AccountResponse)
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db)
):
    new_account = Account(**account.dict())
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account
