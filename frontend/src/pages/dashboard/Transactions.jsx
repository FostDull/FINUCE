import { useEffect, useState } from "react";
import { getTransactions } from "../../services/paymentService";

/* =========================
   Stripe status mapper
========================= */
const mapStripeStatus = (status) => {
  switch (status) {
    case "succeeded":
      return {
        label: "Exitoso",
        style: "bg-green-100 text-green-700",
      };

    case "processing":
      return {
        label: "Pendiente",
        style: "bg-yellow-100 text-yellow-700",
      };

    case "requires_payment_method":
    case "requires_confirmation":
    case "requires_action":
      return {
        label: "Incompleto",
        style: "bg-gray-100 text-gray-600",
      };

    case "canceled":
      return {
        label: "Cancelado",
        style: "bg-red-100 text-red-700",
      };

    default:
      return {
        label: status,
        style: "bg-gray-100 text-gray-600",
      };
  }
};

/* =========================
   Payment method formatter
========================= */
const formatPaymentMethod = (tx) => {
  const card = tx.payment_method_details?.card;
  if (!card) return "—";
  return `${card.brand.toUpperCase()} •••• ${card.last4}`;
};

/* =========================
   Currency formatter
========================= */
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data ?? []);
    } catch (err) {
      console.error("Error loading transactions", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading transactions…</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Transactions</h2>
        <p className="text-sm text-gray-500">Payment history</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-sm text-gray-500 text-center">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-500">
                  <th className="px-6 py-4 font-medium text-left">Date</th>
                  <th className="px-6 py-4 font-medium text-left">Method</th>
                  <th className="px-6 py-4 font-medium text-left">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => {
                  const amountCents = tx.amount ?? 0; // Asegúrate de que el monto está en centavos
                  const amountUSD = amountCents / 100; // Convertir a dólares si está en centavos

                  const date = tx.created_at
                    ? new Date(tx.created_at) // Convertimos a Date
                    : null;

                  // Formatear la fecha si está disponible
                  const formattedDate = date
                    ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
                    : "—";

                  const statusUI = mapStripeStatus(tx.status);

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Date */}
                      <td className="px-6 py-4">{formattedDate}</td>

                      {/* Method */}
                      <td className="px-6 py-4 text-gray-700">
                        {formatPaymentMethod(tx)} {/* Payment method */}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusUI.style}`}
                        >
                          {statusUI.label} {/* Payment status */}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {usdFormatter.format(amountUSD)} {/* Amount in USD */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
