from fastapi import BackgroundTasks
from app.tasks.payment_tasks import check_payments
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from decimal import Decimal

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


@router.post("/", response_model=PaymentResponse)
def create_payment(
    data: PaymentCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = db.query(Account).filter(
        Account.user_id == str(user["sub"])
    ).first()

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found for this user"
        )

    payment = Payment(
        account_id=account.id,
        amount=data.amount,
        status="pending"
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


@router.get("/", response_model=list[PaymentResponse])
def get_payments(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Payment).join(Account).filter(
        Account.user_id == str(user["sub"])
    ).all()


@router.post("/{payment_id}/pay")
def pay_payment(
    payment_id: UUID,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payment = db.query(Payment).get(payment_id)

    if not payment:
        raise HTTPException(404, "Payment not found")

    # 🔒 Verificar que el pago pertenezca al usuario
    account = db.query(Account).filter(
        Account.id == payment.account_id,
        Account.user_id == str(user["sub"])
    ).first()

    if not account:
        raise HTTPException(403, "Not authorized to pay this payment")

    if payment.status != "pending":
        raise HTTPException(400, "Payment not available")

    intent = stripe.PaymentIntent.create(
        amount=int(payment.amount * 100),  # Stripe usa centavos
        currency="usd",
        metadata={
            "payment_id": str(payment.id)
        }
    )

    payment.stripe_payment_intent_id = intent.id
    payment.status = "processing"
    db.commit()

    return {
        "client_secret": intent.client_secret
    }


@router.post("/check")
def check_payment_status(background_tasks: BackgroundTasks):
    background_tasks.add_task(check_payments)
    return {"status": "checking payments"}
