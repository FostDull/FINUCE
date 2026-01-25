from app.core.supabase import get_supabase_client

from app.services.notifications_service import create_notification
from app.services.notification_guard import already_notified, mark_as_notified


def process_payment_status(payment):
    payment_id = payment["id"]
    user_id = payment["user_id"]
    status = payment["status"]

    if already_notified(payment_id):
        return

    if status == "paid":
        create_notification(
            user_id,
            "Pago confirmado",
            f"Tu pago de ${payment['amount']} fue procesado con éxito ✅"
        )
        mark_as_notified(payment_id)

    elif status == "failed":
        create_notification(
            user_id,
            "Pago fallido",
            "Hubo un problema con tu pago ❌"
        )
        mark_as_notified(payment_id)
