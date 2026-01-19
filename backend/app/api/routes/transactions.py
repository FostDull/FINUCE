from backend.app.deps.auth import get_current_user
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
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    account = db.query(Account).filter(
        Account.id == data.account_id
        Account.user_id == user["sub"]
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if data.type == "debit" and account.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # 💰 Update balance
    if data.type == "credit":
        account.balance += data.amount
    elif data.type == "debit":
        account.balance -= data.amount
    else:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    transaction = Transaction(
        account_id=account.id,
        type=data.type,
        amount=data.amount
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction
