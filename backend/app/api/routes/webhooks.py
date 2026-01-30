from fastapi import APIRouter, Request, HTTPException
import stripe

from app.core.config import STRIPE_WEBHOOK_SECRET
from app.core.mongo import payments_collection
from app.core.mongo import notifications_collection

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

    intent = event["data"]["object"]

    if event["type"] == "payment_intent.succeeded":
        await payments_collection.update_one(
            {"stripe_payment_intent_id": intent["id"]},
            {"$set": {"status": "paid"}}
        )

    elif event["type"] == "payment_intent.payment_failed":
        await payments_collection.update_one(
            {"stripe_payment_intent_id": intent["id"]},
            {"$set": {"status": "failed"}}
        )

    return {"status": "ok"}
