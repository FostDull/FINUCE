from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.core.database import get_db
from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionResponse)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db)
):
    # 1. Buscar la cuenta (SQLAlchemy manejará el UUID automáticamente si data.account_id es UUID)
    # Usamos with_for_update() para bloquear la fila y evitar condiciones de carrera (Race Conditions)
    account = db.query(Account).with_for_update().filter(
        Account.id == data.account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 2. Validación de fondos (aseguramos que ambos sean Decimal)
    # data.amount ya viene como Decimal por el esquema corregido
    if data.type == "debit" and account.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    try:
        # 3. Actualizar el saldo de la cuenta
        if data.type == "credit":
            account.balance += data.amount
        else:
            account.balance -= data.amount

        # 4. Crear el registro de la transacción
        # Usamos data.model_dump() (Pydantic v2) para crear el objeto
        new_transaction = Transaction(**data.model_dump())

        db.add(new_transaction)

        # 5. Commit atómico: o se guardan ambos (saldo y tx) o nada
        db.commit()
        db.refresh(new_transaction)

        return new_transaction

    except Exception as e:
        db.rollback()
        # Loguear el error real en consola para debuggear
        print(f"Error en transacción: {e}")
        raise HTTPException(status_code=500, detail="Transaction failed")
