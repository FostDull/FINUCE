from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import stripe

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.config import STRIPE_SECRET_KEY
from app.models.account import Account
from app.models.payment import Payment
from app.schemas.payment import PaymentResponse

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create-intent")
def create_payment_intent(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = (
        db.query(Account)
        .filter(Account.user_id == str(user["sub"]))
        .first()
    )

    if not account:
        raise HTTPException(404, "Account not found")

    payment = Payment(
        account_id=account.id,
        amount=50,  # ejemplo fijo
        status="pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    intent = stripe.PaymentIntent.create(
        amount=int(payment.amount * 100),
        currency="usd",
        metadata={"payment_id": str(payment.id)},
    )

    payment.stripe_payment_intent_id = intent.id
    payment.status = "processing"
    db.commit()

    return {"client_secret": intent.client_secret}


@router.get("/", response_model=list[PaymentResponse])
def list_my_payments(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Payment)
        .join(Account)
        .filter(Account.user_id == str(user["sub"]))
        .order_by(Payment.created_at.desc())
        .all()
    )
