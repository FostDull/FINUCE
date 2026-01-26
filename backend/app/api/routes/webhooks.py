from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
import stripe

from uuid import UUID
from app.core.database import get_db
from app.models.payment import Payment
from app.models.transaction import Transaction
from app.models.account import Account
from app.core.config import STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

# 🔑 Stripe config
stripe.api_key = STRIPE_SECRET_KEY


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")

    # 🔐 Definir event como None inicialmente para evitar NameError
    event = None

    # 🔐 Verificar firma
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError as e:
        print(f"❌ Error de firma: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")
    except ValueError as e:
        print(f"❌ Payload inválido: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except Exception as e:
        print(f"❌ Error inesperado verificando webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    # 🛑 Si por alguna razón event sigue siendo None, salir
    if not event:
        return {"received": False, "error": "Event not constructed"}

    # ⚠️ Ahora sí puedes usar event["type"] con seguridad
    if event["type"] != "payment_intent.succeeded":
        return {"received": True}

    intent = event["data"]["object"]

    # 📝 DEBUG: Esto es vital para ver qué envía Stripe en la terminal de Docker
    print(
        f"DEBUG: Procesando intent {intent['id']} con metadata: {intent.get('metadata')}")

    payment_id_str = intent.get("metadata", {}).get("payment_id")

    if not payment_id_str:
        print("DEBUG: Webhook ignorado - No hay payment_id en metadata")
        return {"received": True}

    try:
        # 1. Convertir y buscar el pago con bloqueo de fila
        payment_id = UUID(payment_id_str)
        payment = (
            db.query(Payment)
            .filter(Payment.id == payment_id)
            .with_for_update()
            .first()
        )

        if not payment:
            print(f"DEBUG: Pago {payment_id} no encontrado en DB")
            return {"received": True}

        if payment.status == "paid":
            return {"received": True}

        # 2. Verificación cruzada de seguridad
        if payment.stripe_payment_intent_id != intent["id"]:
            print("DEBUG: Mismatch de PaymentIntent ID")
            raise HTTPException(
                status_code=400, detail="PaymentIntent mismatch")

        # 3. Actualización atómica de Balance y Transacción
        payment.status = "paid"

        account = (
            db.query(Account)
            .filter(Account.id == payment.account_id)
            .with_for_update()
            .first()
        )

        if not account:
            raise RuntimeError("Account not found")

        # Actualizar saldo
        account.balance += payment.amount

        # Registrar historial
        transaction = Transaction(
            account_id=account.id,
            amount=payment.amount,
            type="income",
            reference=f"Stripe: {intent['id']}",
        )

        db.add(transaction)
        db.commit()
        print(f"✅ ¡ÉXITO! Saldo actualizado para cuenta {account.id}")

    except Exception as e:
        db.rollback()
        print(f"❌ ERROR en Webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {"received": True}
