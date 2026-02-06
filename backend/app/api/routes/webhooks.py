from fastapi import APIRouter, Request, HTTPException
from datetime import datetime
import stripe
import logging

from app.core.config import STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY
from app.core.mongo import payments_collection

stripe.api_key = STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/stripe")
async def stripe_webhook(request: Request):
    """
    Webhook oficial de Stripe.
    ⚠️ Solo Stripe puede llamar a este endpoint.
    """

    # 1️⃣ Leer payload y firma
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        logger.warning("Webhook sin Stripe-Signature")
        raise HTTPException(status_code=400, detail="Missing Stripe-Signature")

    # 2️⃣ Verificar firma
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=STRIPE_WEBHOOK_SECRET,
        )
        logger.info(f"Evento de Stripe recibido: {event}")  # Log para verificar el evento completo
    except stripe.error.SignatureVerificationError:
        logger.error("Firma Stripe inválida")
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")
    except ValueError:
        logger.error("Payload inválido")
        raise HTTPException(status_code=400, detail="Invalid payload")

    event_type = event["type"]
    intent = event["data"]["object"]
    intent_id = intent["id"]

    logger.info(f"📩 Stripe event: {event_type} | {intent_id}")

    # 🔹 Base update (idempotente)
    base_filter = {"stripe_payment_intent_id": intent_id}

    # 3️⃣ Payment succeeded
    if event_type == "payment_intent.succeeded":
        logger.info(f"Pago exitoso para {intent_id}")

        payment_method_id = intent.get("payment_method")

        card_info = {}
        if payment_method_id:
            try:
                pm = stripe.PaymentMethod.retrieve(payment_method_id)
                if pm["type"] == "card":
                    card_info = {
                        "payment_method": "card",
                        "brand": pm["card"]["brand"],
                        "last4": pm["card"]["last4"],
                    }
            except Exception as e:
                logger.warning(f"No se pudo obtener método de pago: {e}")

        update = {
            "status": intent["status"],  # succeeded
            "amount_received": intent.get("amount_received", 0) / 100,  # Convertimos a dólares
            "currency": intent.get("currency"),
            "paid_at": datetime.utcnow(),
            **card_info,
        }

        result = payments_collection.update_one(
            base_filter,
            {"$set": update},
            upsert=False,
        )

        logger.info(
            f"✅ Payment actualizado "
            f"(matched={result.matched_count}, modified={result.modified_count})"
        )

    # 4️⃣ Payment failed
    elif event_type == "payment_intent.payment_failed":
        error = intent.get("last_payment_error", {})

        payments_collection.update_one(
            base_filter,
            {
                "$set": {
                    "status": "failed",
                    "failure_reason": error.get("message", "unknown"),
                    "failed_at": datetime.utcnow(),
                }
            }
        )

        logger.warning(f"❌ Payment fallido: {intent_id}")

    # 5️⃣ Payment canceled
    elif event_type == "payment_intent.canceled":
        payments_collection.update_one(
            base_filter,
            {
                "$set": {
                    "status": "canceled",
                    "canceled_at": datetime.utcnow(),
                }
            }
        )

        logger.info(f"⏹️ Payment cancelado: {intent_id}")

    # 6️⃣ Otros eventos (ignorados)
    else:
        logger.debug(f"Evento ignorado: {event_type}")

    # 7️⃣ Stripe exige 200 OK
    return {"received": True}
