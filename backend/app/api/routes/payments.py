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
def create_payment_intent(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1️⃣ Buscar cuenta del usuario
    account = (
        db.query(Account)
        .filter(Account.user_id == str(user["sub"]))
        .first()
    )

    if not account:
        raise HTTPException(404, "Account not found")

    amount = 50.00  # ⚠️ luego lo haces dinámico

    # 2️⃣ Crear pago en DB
    payment = Payment(
        account_id=account.id,
        amount=amount,
        status="processing",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    # 3️⃣ Crear PaymentIntent en Stripe
    intent = stripe.PaymentIntent.create(
        amount=int(amount * 100),  # centavos
        currency="usd",
        automatic_payment_methods={
            "enabled": True
        },
        metadata={
            "payment_id": str(payment.id),
            "account_id": str(account.id),
        },
    )

    # 4️⃣ Guardar intent ID
    payment.stripe_payment_intent_id = intent.id
    db.commit()

    # 5️⃣ Enviar client_secret a React
    return {
        "client_secret": intent.client_secret,
        "payment_id": payment.id,
    }
