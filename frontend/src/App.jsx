import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./routes/PrivateRoute"; // Asegúrate de que esto esté bien

import DashboardHome from "./pages/dashboard/DashboardHome";
import Payments from "./pages/dashboard/Payments";
import Transactions from "./pages/dashboard/Transactions";
import PaymentMethod from "./pages/dashboard/PaymentMethod";
import Configuration from "./pages/dashboard/Configuration";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Subroutes of DashboardLayout */}
          <Route index element={<DashboardHome />} />
          <Route path="payments" element={<Payments />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="/dashboard/payment-method" element={<PaymentMethod />} />
          <Route path="config" element={<Configuration />} />
        </Route>
      </Route>
    </Routes>
  );
}
