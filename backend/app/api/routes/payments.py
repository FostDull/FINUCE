import stripe
from fastapi import APIRouter, HTTPException, status
import logging

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
        intent = stripe.PaymentIntent.create(
            amount=data.amount,
            currency=data.currency.lower(),
            description=data.description,
            metadata={
                "environment": "development",
                "source": "fin-uce",
            }
        )

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
