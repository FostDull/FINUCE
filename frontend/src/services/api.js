const API_URL = import.meta.env.VITE_API_URL;

export async function createPayment(amount, token) {
  const res = await await fetch("http://localhost:8000/payments/create-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  },
  body: JSON.stringify({
    amount: 5000,
  }),
})

  return res.json();
}
