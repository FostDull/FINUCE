import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPayment } from "../../services/paymentService";
import StripePaymentForm from "../../components/ui/StripePaymentForm";

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PK) {
  throw new Error("VITE_STRIPE_PUBLISHABLE_KEY no está definida");
}

const stripePromise = loadStripe(STRIPE_PK);

export default function PaymentMethod() {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);

  const location = useLocation();
  const amount = Number(new URLSearchParams(location.search).get("amount"));

  useEffect(() => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setPaymentError("Monto no válido");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await createPayment(amount);
        if (!res?.client_secret) {
          throw new Error("Stripe no devolvió client_secret");
        }
        setClientSecret(res.client_secret);
      } catch (err) {
        setPaymentError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [amount]);

  if (loading) {
    return <p className="p-6 text-center">Cargando pago…</p>;
  }

  if (paymentError) {
    return <p className="p-6 text-center text-red-600">{paymentError}</p>;
  }

  // ⚠️ OJO: Elements solo se renderiza si clientSecret existe
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Método de Pago</h2>

      {!clientSecret && !paymentError && (
        <p className="text-gray-600">Inicializando pago…</p>
      )}

      {paymentError && <p className="text-red-600">{paymentError}</p>}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm />
        </Elements>
      )}
    </div>
  );
}
