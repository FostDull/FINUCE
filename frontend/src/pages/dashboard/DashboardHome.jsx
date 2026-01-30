import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/dashboardService";

const DashboardHome = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
  }, []);

  if (!summary) return <p>Cargando...</p>;

  return (
    <>
      <h2>Hoy</h2>

      <div style={{ display: "flex", gap: "24px" }}>
        <div>
          <p>Volumen bruto</p>
          <h3>${summary.today_volume.toFixed(2)} USD</h3>
        </div>

        <div>
          <p>Pagos realizados</p>
          <h3>{summary.today_count}</h3>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
