import stripe
import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.core.mongo import payments_collection, products_collection
from app.schemas.payment import PaymentIntentRequest, PaymentIntentResponse
from app.core.config import STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)
stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(data: PaymentIntentRequest):

    try:
        intent = stripe.PaymentIntent.create(
            amount=data.amount,  # centavos
            currency=data.currency.lower(),
            description=data.description,
            automatic_payment_methods={"enabled": True},
        )

        payments_collection.insert_one({
            "stripe_payment_intent_id": intent.id,
            "amount": data.amount / 100,
            "currency": data.currency.lower(),
            "status": intent.status,  # requires_payment_method
            "created_at": datetime.utcnow(),
        })

        return PaymentIntentResponse(client_secret=intent.client_secret)

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/get-products")
async def get_products():
    try:
        products = stripe.Product.list(active=True, limit=10)
        prices = stripe.Price.list(active=True)

        price_map = {p.product: p for p in prices.data}

        formatted_products = []

        for product in products.data:
            price = price_map.get(product.id)
            if not price:
                continue

            formatted_products.append({
                "id": product.id,
                "price_id": price.id,
                "name": product.name,
                "description": product.description,
                "price": price.unit_amount,
                "currency": price.currency,
            })

            # ⛔ Insertar SOLO si no existe
            products_collection.update_one(
                {"stripe_product_id": product.id},
                {
                    "$setOnInsert": {
                        "stripe_product_id": product.id,
                        "stripe_price_id": price.id,
                        "name": product.name,
                        "description": product.description,
                        "price": price.unit_amount / 100,
                        "currency": price.currency,
                        "created_at": datetime.utcnow(),
                    }
                },
                upsert=True,
            )

        return {"products": formatted_products}

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
