from pydantic import BaseModel, Field
from typing import Optional


class PaymentIntentRequest(BaseModel):
    amount: int = Field(
        ...,
        gt=0,
        description="Monto en centavos. Ej: 5000 = $50.00"
    )
    currency: str = Field(
        default="usd",
        min_length=3,
        max_length=3
    )
    description: Optional[str] = None


class PaymentIntentResponse(BaseModel):
    client_secret: str
