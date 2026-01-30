import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getRevenueLast7Days,
  getCompareTodayYesterday,
} from "../../services/dashboardService";

const DashboardHome = () => {
  const [chartData, setChartData] = useState([]);
  const [compare, setCompare] = useState(null);

  useEffect(() => {
    getRevenueLast7Days().then((res) => setChartData(res.data));
    getCompareTodayYesterday().then(setCompare);
  }, []);

  return (
    <>
      <h2>Dashboard</h2>

      {/* 🔹 Comparación */}
      {compare && (
        <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
          <div>
            <strong>Hoy</strong>
            <div>${compare.today.toFixed(2)} USD</div>
          </div>

          <div>
            <strong>Ayer</strong>
            <div>${compare.yesterday.toFixed(2)} USD</div>
          </div>

          <div>
            <strong>Diferencia</strong>
            <div
              style={{
                color: compare.difference >= 0 ? "green" : "red",
              }}
            >
              {compare.difference >= 0 ? "+" : ""}$
              {compare.difference.toFixed(2)} USD
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Gráfica */}
      <h3>Últimos 7 días</h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(v) => `$${v} USD`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#635bff" // Stripe style
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DashboardHome;
