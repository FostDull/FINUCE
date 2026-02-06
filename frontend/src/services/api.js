const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   Crear pago (Stripe)
========================= */
export async function createPayment(amount) {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida");
  }

  if (!amount || amount <= 0) {
    throw new Error("Monto inválido");
  }

  // Convertir monto a centavos si es en dólares
  const amountInCents = Math.round(Number(amount) * 100); // Convertimos a centavos

  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInCents, // Enviar en centavos
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

/* =========================
   Obtener transacciones
========================= */
export async function getTransactions() {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida");
  }

  // Hacer la solicitud a la API para obtener las transacciones
  const res = await fetch(`${API_URL}/payments/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Verificar si la respuesta fue exitosa
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error obteniendo transacciones");
  }

  // Obtener los datos de las transacciones
  const data = await res.json();

  // Convertir los montos de centavos a dólares antes de devolverlos
  const transactions = data.transactions.map((tx) => {
    const amountUSD = tx.amount / 100; // Convertir el monto de centavos a dólares

    // Asegurarse de que la fecha esté correctamente formateada
    const date = tx.created_at ? new Date(tx.created_at) : new Date();

    return {
      ...tx, // Mantener todos los demás datos intactos
      amount: amountUSD, // Actualizar el monto con el valor en dólares
      created_at: date.toLocaleString(), // Asegurarse de que la fecha sea legible
    };
  });

  // Devolver las transacciones ya convertidas
  return { ...data, transactions };
}
