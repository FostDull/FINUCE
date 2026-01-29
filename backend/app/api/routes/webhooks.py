from fastapi import APIRouter, Request, HTTPException
import stripe

from app.core.config import STRIPE_WEBHOOK_SECRET
from app.core.database import SessionLocal
from app.models.payment import Payment

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            STRIPE_WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid signature")

    db = SessionLocal()

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]

        payment = (
            db.query(Payment)
            .filter(Payment.stripe_payment_intent_id == intent["id"])
            .first()
        )

        if payment:
            payment.status = "paid"
            db.commit()

    elif event["type"] == "payment_intent.payment_failed":
        intent = event["data"]["object"]

        payment = (
            db.query(Payment)
            .filter(Payment.stripe_payment_intent_id == intent["id"])
            .first()
        )

        if payment:
            payment.status = "failed"
            db.commit()

    return {"status": "ok"}
