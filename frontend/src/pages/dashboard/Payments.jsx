import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Usaremos esto para redirigir
import { getProducts } from "../../services/paymentService";

export default function Payments() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para redirigir

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

  const handlePayment = (amount) => {
    // Redirigir a PaymentMethod pasando el monto como parámetro
    navigate(`/dashboard/payment-method?amount=${amount}`);
  };

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
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-[#0A1F44]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        ></path>
                      </svg>
                    </div>
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
                    onClick={() => handlePayment(product.price)}
                  >
                    Pagar ahora
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
    </div>
  );
}
