import { Outlet } from "react-router-dom";
import Sidebar from "../components/auth/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <Sidebar />

      {/* ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-[#0A1F44] tracking-tight uppercase">
              Resumen de Cuenta
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800 uppercase leading-none">
                Usuario FinUCE
              </p>
              <p className="text-[10px] text-green-600 font-medium mt-1">
                Conexión Segura
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-500 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto text-slate-800">
            {/* Aquí se renderizarán las rutas hijas */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
