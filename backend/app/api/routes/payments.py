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


@router.post("/create-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(data: PaymentIntentRequest):

    intent = stripe.PaymentIntent.create(
        amount=data.amount,                     # en centavos
        currency=data.currency.lower(),
        description=data.description,
        automatic_payment_methods={"enabled": True},
    )

    payments_collection.insert_one({
        "stripe_payment_intent_id": intent.id,   # 🔑 CLAVE CORRECTA
        "amount": data.amount,
        "currency": data.currency.lower(),
        "status": intent.status,                 # requires_payment_method
        "created_at": datetime.utcnow()
    })

    return PaymentIntentResponse(
        client_secret=intent.client_secret
    )


@router.get("/get-products")
async def get_products():
    try:
        products = stripe.Product.list(limit=10)
        # Agrega este log
        logger.info(f"Productos obtenidos: {len(products.data)}")
        formatted_products = [
            {"id": product.id, "name": product.name,
                "description": product.description, "created": product.created}
            for product in products.data
        ]
        return {"products": formatted_products}
    except stripe.error.StripeError as e:
        # Agregar log de error
        logger.error(f"Error al obtener productos de Stripe: {str(e)}")
        return {"error": str(e)}
