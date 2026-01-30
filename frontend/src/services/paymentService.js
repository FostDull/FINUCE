const API_URL = import.meta.env.VITE_API_URL;

export async function createPayment(amount) {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida");
  }

  if (!amount || amount <= 0) {
    throw new Error("Monto inválido");
  }

  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Number(amount),
      currency: "usd",
      description: "Pago de prueba",
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error creando payment intent");
  }

  return res.json();
}

export async function getTransactions() {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida");
  }

  const res = await fetch(`${API_URL}/payments/transactions`)

  if (!res.ok) {
    throw new Error("Error obteniendo transacciones");
  }

  return res.json();
}