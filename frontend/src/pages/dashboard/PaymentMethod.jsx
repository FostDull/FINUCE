import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPayment, getProducts } from "../../services/paymentService";
import StripePaymentForm from "../../components/ui/StripePaymentForm";

// Cargar la clave pública de Stripe desde las variables de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentMethod() {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Función para crear un pago en Stripe
  const handleCreatePayment = async (amount) => {
    try {
      setLoading(true);
      const { client_secret } = await createPayment(amount); // Enviar la cantidad en centavos
      setClientSecret(client_secret); // Guardar el client_secret
    } catch (e) {
      console.error("Error creating payment:", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-section">
      <h2 className="products-title">Productos disponibles</h2>

      {productsLoading ? (
        <p className="loading-text">Cargando productos...</p>
      ) : (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-card-body">
                  <h3 className="product-name">{product.name}</h3>

                  <p className="product-description">
                    {product.description || "Descripción no disponible"}
                  </p>

                  <div className="product-price">
                    ${(product.price / 100).toFixed(2)} USD
                  </div>

                  <button
                    className="product-button"
                    onClick={() => handleCreatePayment(product.price)}
                    disabled={loading}
                  >
                    {loading ? "Proccessing..." : "PAY NOW"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm />
        </Elements>
      )}
    </div>
  );
}
