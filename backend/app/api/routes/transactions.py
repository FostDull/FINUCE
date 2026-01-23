from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionResponse)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db)
):
    account = db.query(Account).filter(Account.id == data.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if data.type == "debit" and account.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    try:
        if data.type == "credit":
            account.balance += data.amount
        else:
            account.balance -= data.amount

        tx = Transaction(**data.model_dump())
        db.add(tx)
        db.commit()
        db.refresh(tx)
        return tx

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Transaction failed")
