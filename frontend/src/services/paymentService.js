export async function createPayment(amount) {
  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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