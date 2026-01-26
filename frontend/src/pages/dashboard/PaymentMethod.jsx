import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { createPayment, payPayment } from "../../services/paymentService";

export default function PaymentMethod() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);

    // 1️⃣ Crear payment en tu backend
    const { data: payment } = await createPayment(20);

    // 2️⃣ Crear intent y obtener client_secret
    const { data } = await payPayment(payment.id);

    // 3️⃣ Confirmar con Stripe
    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      alert("✅ Pago completado");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Agregar fondos</h2>

      <CardElement />

      <button onClick={handlePay} disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar $20"}
      </button>
    </div>
  );
}
