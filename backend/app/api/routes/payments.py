from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

import stripe

from app.core.database import get_db
from app.models.payment import Payment
from app.models.account import Account
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.core.auth import get_current_user
from app.core.config import STRIPE_SECRET_KEY

# 🔑 Configurar Stripe
stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix="/payments", tags=["Payments"])


# 🟢 Crear pago (NO toca Stripe)
@router.post("/", response_model=PaymentResponse)
def create_payment(
    data: PaymentCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = (
        db.query(Account)
        .filter(Account.user_id == str(user["sub"]))
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found for this user",
        )

    payment = Payment(
        account_id=account.id,
        amount=data.amount,
        status="pending",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


# 🟢 Listar pagos del usuario
@router.get("/", response_model=list[PaymentResponse])
def get_payments(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Payment)
        .join(Account)
        .filter(Account.user_id == str(user["sub"]))
        .all()
    )


# 🟢 Iniciar pago en Stripe
@router.post("/{payment_id}/pay")
def pay_payment(
    payment_id: UUID,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise HTTPException(404, "Payment not found")

    account = (
        db.query(Account)
        .filter(
            Account.id == payment.account_id,
            Account.user_id == str(user["sub"]),
        )
        .first()
    )

    if not account:
        raise HTTPException(403, "Not authorized to pay this payment")

    if payment.status != "pending":
        raise HTTPException(400, "Payment is not available for payment")

    # 🔥 Stripe PaymentIntent
    intent = stripe.PaymentIntent.create(
        amount=int(payment.amount * 100),  # centavos
        currency="usd",
        metadata={
            "payment_id": str(payment.id),
            "account_id": str(account.id),
        },
    )

    payment.stripe_payment_intent_id = intent.id
    payment.status = "processing"
    db.commit()

    return {
        "client_secret": intent.client_secret
    }
