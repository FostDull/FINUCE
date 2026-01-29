import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const STRIPE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_PON_AQUI_TU_CLAVE_DIRECTAMENTE";
const stripePromise = loadStripe(STRIPE_KEY);

console.log("Cargando Stripe con:", STRIPE_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
