const API_URL = import.meta.env.VITE_API_URL;

export async function getRevenueLast7Days() {
  const res = await fetch(`${API_URL}/dashboard/revenue-7-days`);
  if (!res.ok) throw new Error("Error cargando gráfica");
  return res.json();
}

export async function getCompareTodayYesterday() {
  const res = await fetch(`${API_URL}/dashboard/compare-today-yesterday`);
  if (!res.ok) throw new Error("Error cargando comparación");
  return res.json();
}