import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PaymentMethod() {
  const [loading, setLoading] = useState(false);

  const createPayment = async () => {
    const res = await fetch("http://localhost:8000/payments/create-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante si usas auth/cookies
    });

    if (!res.ok) {
      throw new Error("Error creating payment");
    }

    return res.json(); // { client_secret }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const data = await createPayment();
      console.log("client_secret:", data.client_secret);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePay} disabled={loading}>
      Pagar
    </button>
  );
}
