import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

export default function PaymentMethod() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/payments/create-intent", {
      method: "POST",
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => setClientSecret(data.client_secret));
  }, []);

  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}
