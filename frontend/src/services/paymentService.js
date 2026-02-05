const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida");
}

/**
 * Manejo centralizado de errores HTTP
 */
const handleError = async (res) => {
  let message = "Error procesando la solicitud";

  try {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await res.json();
      message = error.detail || error.message || message;
    }
  } catch (_) {}

  throw new Error(`Error ${res.status}: ${message}`);
};

/**
 * Crear PaymentIntent en Stripe
 */
export async function createPayment(amount) {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Monto inválido");
  }

  // Stripe trabaja SIEMPRE en centavos (enteros)
  const amountInCents = Math.round(Number(amount));

  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInCents,
      currency: "usd",
      description: "Pago de producto",
    }),
  });

  if (!res.ok) {
    await handleError(res);
  }

  return res.json();
}

/**
 * Obtener transacciones
 */
export async function getTransactions() {
  const res = await fetch(`${API_URL}/payments/transactions`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleError(res);
  }

  return res.json();
}

/**
 * Obtener resumen del dashboard
 */
export async function getDashboardSummary() {
  const res = await fetch(`${API_URL}/dashboard/summary`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleError(res);
  }

  return res.json();
}

/**
 * Obtener productos desde Stripe (vía backend)
 */
export async function getProducts() {
  const res = await fetch(`${API_URL}/payments/get-products`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleError(res);
  }

  return res.json(); // { products: [...] }
}
