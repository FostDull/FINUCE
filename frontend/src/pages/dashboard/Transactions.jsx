import { useEffect, useState } from "react";
import { getTransactions } from "../../services/paymentService";

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  requires_payment_method: "bg-yellow-100 text-yellow-700",
};

const statusLabel = {
  paid: "Exitoso",
  failed: "Fallido",
  requires_payment_method: "Pendiente",
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">Cargando transacciones…</div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Transacciones</h2>
        <p className="text-sm text-gray-500">Historial de pagos procesados</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No existen transacciones registradas.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Método</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Importe</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {tx.payment_method ?? "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusStyles[tx.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabel[tx.status] ?? tx.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    ${tx.amount.toFixed(2)}{" "}
                    <span className="text-gray-400 uppercase">
                      {tx.currency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
