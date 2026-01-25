from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
import stripe

from app.core.database import get_db
from app.models.payment import Payment
from app.models.transaction import Transaction
from app.models.account import Account
from app.core.config import STRIPE_WEBHOOK_SECRET

router = APIRouter()


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        payment_id = intent["metadata"].get("payment_id")

        if not payment_id:
            return {"ok": True}

        payment = db.get(Payment, payment_id)

        if not payment or payment.status == "paid":
            return {"ok": True}

        try:
            payment.status = "paid"

            account = db.get(Account, payment.account_id)
            account.balance += payment.amount

            tx = Transaction(
                account_id=payment.account_id,
                amount=payment.amount,
                type="income"
            )

            db.add(tx)
            db.commit()

        except Exception:
            db.rollback()
            raise

    return {"ok": True}
