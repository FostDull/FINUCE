import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../../components/ui/StripePaymentForm";
import { createPayment } from "../../services/paymentService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentMethod() {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      const { client_secret } = await createPayment(5000); // 50.00 USD
      setClientSecret(client_secret);
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!clientSecret && (
        <button onClick={handleCreatePayment} disabled={loading}>
          {loading ? "Creando pago..." : "Pagar"}
        </button>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm />
        </Elements>
      )}
    </div>
  );
}
