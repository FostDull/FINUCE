import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  getRevenueLast7Days,
  getCompareTodayYesterday,
} from "../../services/dashboardService";

/* =========================
   Helpers
========================= */
const usd = (value) => `$${Number(value).toFixed(2)}`;

const DashboardHome = () => {
  const [chartData, setChartData] = useState([]);
  const [compare, setCompare] = useState(null);

  useEffect(() => {
    getRevenueLast7Days().then((res) => setChartData(res.data ?? []));
    getCompareTodayYesterday().then(setCompare);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Revenue overview and performance
        </p>
      </div>

      {/* KPIs */}
      {compare && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Today */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Today</p>
            <p className="text-2xl font-semibold text-gray-900">
              {usd(compare.today)}
            </p>
          </div>

          {/* Yesterday */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Yesterday</p>
            <p className="text-2xl font-semibold text-gray-900">
              {usd(compare.yesterday)}
            </p>
          </div>

          {/* Difference */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Difference</p>
            <p
              className={`text-2xl font-semibold ${
                compare.difference >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {compare.difference >= 0 ? "+" : ""}
              {usd(compare.difference)}
            </p>
          </div>
        </div>
      )}

      {/* Chart Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue – Last 7 days
          </h3>
          <p className="text-sm text-gray-500">Daily income summary</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(value) => usd(value)}
                labelStyle={{ fontWeight: 600 }}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#E5E7EB",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563EB" // azul profesional
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
