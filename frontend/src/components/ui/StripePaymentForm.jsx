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
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      console.log("✅ Pago confirmado");
      // window.location.href = "/dashboard/transactions";
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6"
    >
      <PaymentElement />

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600 font-medium">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`
          mt-6 w-full flex items-center justify-center gap-2
          rounded-lg px-6 py-3 text-sm font-semibold
          transition-all duration-200
          ${
            loading || !stripe
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
          }
        `}
      >
        {loading ? (
          <>
            <svg
              className="w-5 h-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Processing…
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
}
