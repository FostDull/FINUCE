import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      label: "Home",
      path: "/dashboard",
      icon: (
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      ),
    },
    {
      label: "Payments",
      path: "/dashboard/payments",
      icon: (
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
    {
      label: "Transactions",
      path: "/dashboard/transactions",
      icon: (
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      ),
    },
    {
      label: "Payment Method",
      path: "/dashboard/payment-method",
      icon: (
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      ),
    },
  ];

  const NavButton = ({ label, path, icon, isRed = false, onClick = null }) => (
    <button
      onClick={onClick || (() => navigate(path))}
      className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 group
    ${
      isActive(path) && !isRed
        ? "bg-[#1e3a8a] text-white shadow-md" /* Azul Marino Intenso Activo */
        : "bg-[#2563eb] text-white hover:bg-red-600" /* Azul Marino Base que cambia a Rojo */
    }
    ${isRed ? "bg-red-600 text-white hover:bg-red-700 mt-auto" : ""} 
  `}
    >
      <svg
        className={`w-5 h-5 shrink-0 transition-colors ${isActive(path) && !isRed ? "text-white" : "text-blue-100 group-hover:text-white"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {icon}
      </svg>
      {isExpanded && (
        <span className="ml-3 font-bold text-sm tracking-wide">{label}</span>
      )}
    </button>
  );

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 flex flex-col justify-between py-6 transition-all duration-300 ${isExpanded ? "w-64" : "w-20"}`}
    >
      <div>
        <div className="px-6 mb-10 flex items-center justify-between">
          {isExpanded && (
            <h2 className="font-bold text-xl text-[#0A1F44]">FIN-UCE</h2>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-200 text-gray-500"
          >
            {isExpanded ? "◀" : "▶"}
          </button>
        </div>
        <nav className="px-3">
          {navItems.map((item) => (
            <NavButton key={item.path} {...item} />
          ))}
        </nav>
      </div>

      <div className="px-3">
        <NavButton
          label="Log out"
          path="/"
          isRed
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          }
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/");
          }}
        />
      </div>
    </aside>
  );
}
