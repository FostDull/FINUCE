import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  // Si está cargando, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, redirigimos a login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay usuario, mostramos las rutas hijas
  return <Outlet />;
}
