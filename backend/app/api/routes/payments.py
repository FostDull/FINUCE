import stripe
import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.core.mongo import payments_collection
from app.schemas.payment import (
    PaymentIntentRequest,
    PaymentIntentResponse
)
from app.core.config import STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post(
    "/create-intent",
    response_model=PaymentIntentResponse,
    status_code=status.HTTP_200_OK
)
async def create_payment_intent(data: PaymentIntentRequest):

    if not STRIPE_SECRET_KEY:
        logger.critical("STRIPE_SECRET_KEY no configurada")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stripe no configurado"
        )

    try:
        # 1️⃣ Crear PaymentIntent en Stripe
        intent = stripe.PaymentIntent.create(
            amount=data.amount,
            currency=data.currency.lower(),
            description=data.description,
            metadata={
                "environment": "development",
                "source": "fin-uce",
            }
        )

        # 2️⃣ GUARDAR EN MONGO (ESTO ERA LO QUE FALTABA)
        payments_collection.insert_one({
            "stripe_payment_intent_id": intent.id,
            "amount": intent.amount,
            "currency": intent.currency,
            "description": intent.description,
            "status": intent.status,  # requires_payment_method
            "payment_method": None,
            "created_at": datetime.utcnow(),
        })

        # 3️⃣ Retornar client_secret al frontend
        return PaymentIntentResponse(
            client_secret=intent.client_secret
        )

    except stripe.error.StripeError:
        logger.exception("Stripe error")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al crear PaymentIntent"
        )

    except Exception:
        logger.exception("Error inesperado en create_payment_intent")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )
