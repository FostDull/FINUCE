from decimal import Decimal
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

# 1. Definir el Enum primero para poder usarlo en las clases


class TransactionType(str, Enum):
    debit = "debit"
    credit = "credit"


class TransactionBase(BaseModel):
    account_id: UUID
    # 2. Usar el Enum aquí asegura validación automática
    type: TransactionType
    # 3. Usar Decimal en lugar de float para precisión financiera
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)


class TransactionCreate(TransactionBase):
    # Puedes añadir campos que solo se envían al crear,
    # como una descripción opcional
    description: Optional[str] = None


class TransactionResponse(TransactionBase):
    id: UUID
    created_at: datetime
    description: Optional[str] = None

    # 4. En Pydantic v2 se usa model_config en lugar de class Config
    model_config = ConfigDict(from_attributes=True)
