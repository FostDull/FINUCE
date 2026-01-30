import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPayment } from "../../services/paymentService";
import StripePaymentForm from "../../components/ui/StripePaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentMethod() {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const amountUSD = 50;

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
    <div className="max-w-xl mx-auto p-6">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Payment Method
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Amount */}
        <div className="mb-6 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
          <span className="text-sm text-blue-700 font-medium">
            Amount to pay
          </span>
          <span className="text-xl font-semibold text-blue-900">
            ${amountUSD.toFixed(2)}
          </span>
        </div>

        {/* Step 1: Create payment */}
        {!clientSecret && (
          <button
            onClick={handleCreatePayment}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating payment…" : "Continue to payment"}
          </button>
        )}

        {/* Step 2: Stripe Form */}
        {clientSecret && (
          <div className="mt-6">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm />
            </Elements>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="mt-4 text-xs text-gray-400 text-center">
        Your payment is processed securely. We never store card details.
      </p>
    </div>
  );
}
