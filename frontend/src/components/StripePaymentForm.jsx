import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { useState } from "react";
import api from "../services/api";

export default function StripePaymentForm({ paymentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // 1️⃣ Pedir client_secret al backend
    const { data } = await api.post(`/payments/${paymentId}/pay`);

    // 2️⃣ Confirmar pago en Stripe
    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Pago procesado");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={loading || !stripe}>Pagar</button>
    </form>
  );
}
