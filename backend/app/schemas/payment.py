from pydantic import BaseModel, Field
from typing import Optional


class PaymentIntentRequest(BaseModel):
    amount: int = Field(..., gt=0)
    currency: str = Field(default="usd", min_length=3, max_length=3)
    description: Optional[str] = None
    user_id: Optional[str] = None   # ✅ ESTA LÍNEA ES CLAVE


class PaymentIntentResponse(BaseModel):
    client_secret: str
