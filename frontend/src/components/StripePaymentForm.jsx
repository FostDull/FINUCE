import { PaymentElement } from "@stripe/react-stripe-js";

export default function StripePaymentForm() {
  return (
    <form>
      <PaymentElement />
      <button type="submit">Confirmar pago</button>
    </form>
  );
}
