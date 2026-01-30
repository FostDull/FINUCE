const API_URL = import.meta.env.VITE_API_URL;

export async function createPayment(amount, token) {
  // 🛑 Validación temprana para evitar 422
  if (!amount || Number(amount) <= 0) {
    throw new Error("Monto inválido");
  }

  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 🔓 Auth deshabilitada en DEV (se mantiene el header por compatibilidad)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      amount: Number(amount),
      currency: "usd",
      description: "Pago de prueba",
    }),
  });

  // 🧠 Manejo explícito de errores HTTP
  if (!res.ok) {
    let detail = "Error creando payment intent";
    try {
      const err = await res.json();
      detail = err?.detail || detail;
    } catch (_) {}
    throw new Error(detail);
  }

  return res.json();
}