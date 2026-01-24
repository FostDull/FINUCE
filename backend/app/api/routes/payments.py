from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

import stripe

from app.core.database import get_db
from app.models.payment import Payment
from app.models.account import Account
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.core.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/", response_model=PaymentResponse)
def create_payment(
    data: PaymentCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = db.query(Account).filter(
        Account.user_id == user["sub"]
    ).first()

    payment = Payment(
        account_id=account.id,
        amount=data.amount
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment
