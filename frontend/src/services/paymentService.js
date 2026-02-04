const API_URL = import.meta.env.VITE_API_URL;

// Función para manejar el error
const handleError = async (res) => {
  const error = await res.json().catch(() => ({}));
  throw new Error(error.detail || "Error procesando la solicitud");
};

// Crear un pago en Stripe
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
      amount: Number(amount),  // Asegurarse de que el monto sea un número
      currency: "usd",
      description: "Pago de prueba",
    }),
  });

  if (!res.ok) {
    await handleError(res); // Maneja el error de la respuesta
  }

  return res.json();
}

// Obtener las transacciones
export async function getTransactions() {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida");
  }

  const res = await fetch(`${API_URL}/payments/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleError(res); // Maneja el error de la respuesta
  }

  return res.json();
}

// Obtener resumen del dashboard
export async function getDashboardSummary() {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida");
  }

  const res = await fetch(`${API_URL}/dashboard/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleError(res); // Maneja el error de la respuesta
  }

  return res.json();
}

// Obtener productos de Stripe
export async function getProducts() {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida");
  }

  const res = await fetch(`${API_URL}/payments/get-products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleError(res); // Maneja el error de la respuesta
  }

  return res.json();  // Devuelve la lista de productos
}