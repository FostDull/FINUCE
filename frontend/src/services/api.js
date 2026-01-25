const API_URL = import.meta.env.VITE_API_URL;

export async function createPayment(amount, token) {
  const res = await fetch(`${API_URL}/payments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });

  return res.json();
}
