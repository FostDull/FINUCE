import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { supabase } from "../../lib/supabase";

// 🔑 Stripe (SOLO publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

console.log("Stripe key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// 🔥 Crear PaymentIntent (auth Supabase)
const createIntent = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No session");

  const res = await fetch("http://localhost:8000/payments/create-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json(); // { client_secret }
};

// ==================== FORM ====================
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/dashboard",
      },
    });

    if (error) {
      console.error(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
    </form>
  );
}

// ==================== PAGE ====================
export default function PaymentMethod() {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    createIntent()
      .then((data) => setClientSecret(data.client_secret))
      .catch((err) => {
        console.error(err);
        setError("Error iniciando el pago");
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (!clientSecret) return <p>Cargando pago...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}
