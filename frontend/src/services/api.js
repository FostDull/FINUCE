const API_URL = import.meta.env.VITE_API_URL;

export async function createPayment(amount, token) {
  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount,
      currency: "usd",
      description: "Pago de prueba",
    }),
  });

  if (!res.ok) {
    throw new Error("Error creando payment intent");
  }

  return res.json();
}
