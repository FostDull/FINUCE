import stripe
from fastapi import APIRouter, Depends, HTTPException

from app.schemas.payment import (
    PaymentIntentRequest,
    PaymentIntentResponse
)
from app.core.auth import get_current_user
from app.core.config import STRIPE_SECRET_KEY

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post(
    "/create-intent",
    response_model=PaymentIntentResponse
)
def create_payment_intent(
    data: PaymentIntentRequest,
    user=Depends(get_current_user),
):
    """
    Crea un PaymentIntent en Stripe.
    Requiere JWT válido en Authorization header.
    """

    try:
        intent = stripe.PaymentIntent.create(
            amount=data.amount,
            currency=data.currency,
            description=data.description,
            metadata={
                "user_id": user.get("sub"),
                "email": user.get("email"),
            }
        )

        return PaymentIntentResponse(
            client_secret=intent.client_secret
        )

    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
