from app.db.supabase import get_supabase_client
from app.services.payment_watcher import process_payment_status


def check_payments():
    supabase = get_supabase_client()

    response = supabase.table("payments") \
        .select("*") \
        .neq("status", "pending") \
        .execute()

    for payment in response.data:
        process_payment_status(payment)
