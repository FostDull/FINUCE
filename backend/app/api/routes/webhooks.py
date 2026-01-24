from fastapi import APIRouter, Request, Depends
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

    event = stripe.Webhook.construct_event(
        payload,
        sig_header,
        STRIPE_WEBHOOK_SECRET
    )

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        payment_id = intent["metadata"]["payment_id"]

        payment = db.query(Payment).get(payment_id)

        if payment and payment.status != "paid":
            payment.status = "paid"

            account = db.query(Account).get(payment.account_id)
            account.balance += payment.amount

            tx = Transaction(
                account_id=payment.account_id,
                amount=payment.amount,
                type="income"
            )

            db.add(tx)
            db.commit()

    return {"ok": True}
