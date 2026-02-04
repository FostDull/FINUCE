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


# En el backend (FastAPI)
@router.get("/get-products")
async def get_products():
    try:
        products = stripe.Product.list(limit=10)

        # Asegúrate de que se esté obteniendo el precio
        formatted_products = []
        for product in products.data:
            # Si el producto tiene un precio
            # Obtener el precio del producto
            price = stripe.Price.list(product=product.id)
            if price.data:
                formatted_products.append({
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "created": product.created,
                    # Asumimos que el precio está en el primer precio
                    "price": price.data[0].unit_amount
                })

        return {"products": formatted_products}
    except stripe.error.StripeError as e:
        return {"error": str(e)}
