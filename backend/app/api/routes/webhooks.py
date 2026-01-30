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
    ⚠️ NO debe llamarse manualmente desde el navegador o Postman.
    Solo Stripe (Dashboard o CLI) puede invocarlo.
    """

    # 1️⃣ Leer payload y firma
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        logger.warning("Webhook llamado sin Stripe-Signature")
        raise HTTPException(
            status_code=400,
            detail="Missing Stripe-Signature header"
        )

    # 2️⃣ Verificar firma
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError:
        logger.error("Firma Stripe inválida")
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")
    except ValueError:
        logger.error("Payload inválido")
        raise HTTPException(status_code=400, detail="Invalid payload")

    # 3️⃣ Datos del evento
    event_type = event["type"]
    intent = event["data"]["object"]
    intent_id = intent["id"]

    logger.info(f"📩 Stripe event recibido: {event_type} | {intent_id}")

    # 4️⃣ Manejo de eventos importantes
    if event_type == "payment_intent.succeeded":
        result = payments_collection.update_one(
            {"stripe_payment_intent_id": intent_id},
            {
                "$set": {
                    "status": "succeeded",
                    "payment_method": intent["payment_method_types"][0],
                    "amount_received": intent.get("amount_received"),
                    "paid_at": datetime.utcnow(),
                }
            }
        )

        logger.info(
            f"✅ PaymentIntent actualizado "
            f"(matched={result.matched_count}, modified={result.modified_count})"
        )

    elif event_type == "payment_intent.payment_failed":
        payments_collection.update_one(
            {"stripe_payment_intent_id": intent_id},
            {
                "$set": {
                    "status": "failed",
                    "failure_reason": (
                        intent.get("last_payment_error", {})
                        .get("message", "unknown")
                    ),
                    "failed_at": datetime.utcnow(),
                }
            }
        )
        logger.warning(f"❌ PaymentIntent fallido: {intent_id}")

    elif event_type == "payment_intent.canceled":
        payments_collection.update_one(
            {"stripe_payment_intent_id": intent_id},
            {
                "$set": {
                    "status": "canceled",
                    "canceled_at": datetime.utcnow(),
                }
            }
        )
        logger.info(f"⏹️ PaymentIntent cancelado: {intent_id}")

    else:
        # Stripe envía MUCHOS eventos que no necesitas
        logger.debug(f"Evento ignorado: {event_type}")

    # 5️⃣ Stripe exige 200 OK
    return {"status": "ok"}
