from fastapi import APIRouter, Request, Depends
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
        # Stripe necesita 2xx para no reintentar
        return {"received": False}

    # 🔐 Verificación de firma
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError as e:
        print(f"❌ Firma inválida: {str(e)}")
        return {"received": False}
    except ValueError as e:
        print(f"❌ Payload inválido: {str(e)}")
        return {"received": False}
    except Exception as e:
        print(f"❌ Error verificando webhook: {str(e)}")
        return {"received": False}

    # 🎯 Solo procesamos pagos exitosos
    if event["type"] != "payment_intent.succeeded":
        return {"received": True}

    intent = event["data"]["object"]

    print(
        f"DEBUG: Intent {intent['id']} metadata: {intent.get('metadata')}"
    )

    payment_id_str = intent.get("metadata", {}).get("payment_id")

    if not payment_id_str:
        print("DEBUG: Sin payment_id en metadata")
        return {"received": True}

    try:
        # 1️⃣ Convertir UUID
        payment_id = UUID(payment_id_str)

        # 2️⃣ Lock del pago
        payment = (
            db.query(Payment)
            .filter(Payment.id == payment_id)
            .with_for_update()
            .first()
        )

        if not payment:
            print(f"DEBUG: Pago {payment_id} no existe")
            return {"received": True}

        # Idempotencia
        if payment.status == "paid":
            return {"received": True}

        # 3️⃣ Verificación cruzada Stripe
        if payment.stripe_payment_intent_id != intent["id"]:
            print("❌ PaymentIntent mismatch")
            return {"received": True}

        # 4️⃣ Lock cuenta
        account = (
            db.query(Account)
            .filter(Account.id == payment.account_id)
            .with_for_update()
            .first()
        )

        if not account:
            print("❌ Account no encontrada")
            return {"received": True}

        # 5️⃣ Actualización atómica
        payment.status = "paid"
        account.balance += payment.amount

        transaction = Transaction(
            account_id=account.id,
            amount=payment.amount,
            type="income",
            reference=f"stripe:{intent['id']}",
        )

        db.add(transaction)
        db.commit()

        print(f"✅ Pago confirmado | Cuenta {account.id} | +{payment.amount}")

    except ValueError:
        print(f"❌ UUID inválido: {payment_id_str}")
        return {"received": True}

    except Exception as e:
        db.rollback()
        print(f"❌ ERROR DB webhook: {str(e)}")
        return {"received": False}

    return {"received": True}
