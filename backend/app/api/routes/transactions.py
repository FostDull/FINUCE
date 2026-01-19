from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.account import Account
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse

router = APIRouter(
    prefix="/api/transactions",
    tags=["Transactions"]
)


@router.get("/", response_model=list[TransactionResponse])
def list_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()


@router.post("/", response_model=TransactionResponse)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db)
):
    account = db.query(Account).filter(
        Account.id == data.account_id
    ).first()

    if not account:
        raise HTTPException(404, "Account not found")

    if data.type == "debit" and account.balance < data.amount:
        raise HTTPException(400, "Insufficient funds")

    if data.type == "credit":
        account.balance += data.amount
    elif data.type == "debit":
        account.balance -= data.amount
    else:
        raise HTTPException(400, "Invalid transaction type")

    tx = Transaction(
        account_id=account.id,
        type=data.type,
        amount=data.amount
    )

    db.add(tx)
    db.commit()
    db.refresh(tx)

    return tx
