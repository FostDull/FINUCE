import { useEffect, useState } from "react";
import { getTransactions } from "../../services/paymentService";

/* =========================
   Status styles
========================= */
const statusStyles = {
  succeeded: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  canceled: "bg-gray-100 text-gray-600",
};

const statusLabel = {
  succeeded: "Succeeded",
  failed: "Failed",
  pending: "Pending",
  canceled: "Canceled",
};

/* =========================
   Formatter
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
                  const amountCents = tx.amount_received ?? tx.amount ?? 0;
                  const amountUSD = amountCents / 100;
                  const date = tx.paid_at ?? tx.created_at;

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Date */}
                      <td className="px-6 py-4">
                        {date ? (
                          <div className="text-gray-700">
                            <div className="font-medium">
                              {new Date(date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(date).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Method */}
                      <td className="px-6 py-4 text-gray-700 uppercase">
                        {tx.payment_method ?? "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            statusStyles[tx.status] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabel[tx.status] ?? tx.status}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {usdFormatter.format(amountUSD)}
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
