from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps.db import get_db
from app.models.account import Account
from app.models.transaction import Transaction

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/")
def list_transactions():
    return {"message": "Transactions endpoint working"}


@router.post("/")
def create_transaction(
    account_id: str,
    amount: float,
    tx_type: str,
    db: Session = Depends(get_db)
):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(404, "Account not found")

    if tx_type == "debit" and account.balance < amount:
        raise HTTPException(400, "Insufficient funds")

    if tx_type == "credit":
        account.balance += amount
    else:
        account.balance -= amount

    tx = Transaction(
        account_id=account.id,
        type=tx_type,
        amount=amount
    )

    db.add(tx)
    db.commit()
    return {"status": "ok"}
