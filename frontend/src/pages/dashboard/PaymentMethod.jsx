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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Productos Disponibles
      </h2>

      {productsLoading ? (
        <p className="text-center text-gray-600">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-indigo-600 text-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/path/to/your-icon.svg"
                      alt="Icono del producto"
                      className="w-16 h-16"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm mb-4">{product.description}</p>
                  <div className="font-semibold text-xl text-white mb-4">
                    ${(product.price / 100).toFixed(2)} USD
                  </div>
                  <button
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                    onClick={() => handleCreatePayment(product.price)}
                    disabled={loading}
                  >
                    {loading ? "Creando pago..." : "Pagar ahora"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No se encontraron productos.
            </p>
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
