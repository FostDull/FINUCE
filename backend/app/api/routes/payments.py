from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import stripe

from app.core.database import get_db
from app.models.payment import Payment
from app.models.account import Account
from app.core.auth import get_current_user
from app.core.config import STRIPE_SECRET_KEY

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create-intent")
def create_intent(
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

    intent = stripe.PaymentIntent.create(
        amount=1000,  # $10.00 (para probar)
        currency="usd",
        automatic_payment_methods={"enabled": True},
        metadata={
            "user_id": str(user["sub"]),
        },
    )

    return {
        "client_secret": intent.client_secret
    }
