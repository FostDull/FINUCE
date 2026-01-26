from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
import stripe

from app.core.database import get_db
from app.models.payment import Payment
from app.models.transaction import Transaction
from app.models.account import Account
from app.core.config import STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

# 🔑 Stripe config
stripe.api_key = STRIPE_SECRET_KEY


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")

    # 🔐 Verificar firma
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")

    # ⚠️ Solo nos importa este evento
    if event["type"] != "payment_intent.succeeded":
        return {"received": True}

    intent = event["data"]["object"]
    payment_id = intent.get("metadata", {}).get("payment_id")

    if not payment_id:
        return {"received": True}

    # 🔒 Lock del payment (idempotencia)
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .with_for_update()
        .first()
    )

    if not payment:
        return {"received": True}

    if payment.status == "paid":
        return {"received": True}

    # 🧠 Verificación cruzada
    if payment.stripe_payment_intent_id != intent["id"]:
        raise HTTPException(
            status_code=400,
            detail="PaymentIntent mismatch",
        )

    try:
        payment.status = "paid"

        account = (
            db.query(Account)
            .filter(Account.id == payment.account_id)
            .with_for_update()
            .first()
        )

        if not account:
            raise RuntimeError("Account not found")

        account.balance += payment.amount

        transaction = Transaction(
            account_id=account.id,
            amount=payment.amount,
            type="income",
            reference="stripe",
        )

        db.add(transaction)
        db.commit()

    except Exception:
        db.rollback()
        raise

    return {"received": True}
