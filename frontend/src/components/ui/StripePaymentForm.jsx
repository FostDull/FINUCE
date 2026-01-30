import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // 🔥 CLAVE
    });

    if (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      console.log("✅ Pago confirmado");

      // 👉 Opcional: redirigir manualmente
      // window.location.href = "/dashboard/transactions";
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      {errorMessage && (
        <p style={{ color: "red", marginTop: 8 }}>{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{ marginTop: 16 }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
