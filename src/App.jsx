import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./routes/PrivateRoute";

import DashboardHome from "./pages/dashboard/DashboardHome";
import SendMoney from "./pages/dashboard/SendMoney";
import Transactions from "./pages/dashboard/Transactions";
import PaymentMethods from "./pages/dashboard/PaymentMethods";
import Configuration from "./pages/dashboard/Configuration";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="send" element={<SendMoney />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="payments" element={<PaymentMethods />} />
          <Route path="config" element={<Configuration />} />
        </Route>
      </Route>
    </Routes>
  );
}
