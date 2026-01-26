import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import StripePaymentForm from "../../components/StripePaymentForm";
import api from "../../services/api";
import { useState } from "react";

export default function PaymentMethod() {
  const [paymentId, setPaymentId] = useState(null);

  const createPayment = async () => {
    const { data } = await api.post("/payments", {
      amount: 1000, // centavos
      currency: "usd",
    });

    setPaymentId(data.id);
  };

  return (
    <div>
      <h2>Agregar fondos</h2>

      {!paymentId && <button onClick={createPayment}>Crear pago</button>}

      {paymentId && (
        <Elements stripe={stripePromise}>
          <StripePaymentForm paymentId={paymentId} />
        </Elements>
      )}
    </div>
  );
}
