import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthLayout({ formType = "login" }) {
  return (
    // CAMBIO CLAVE: w-full y h-screen para llenar todo el navegador
    <div className="flex w-full min-h-screen bg-white overflow-hidden">
      {/* LADO IZQUIERDO: Dale un flex-1 para que crezca */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-[#F8F9FA] p-12">
        <div className="max-w-md w-full">
          {/* Contenido de marca y escudo... */}
          <div className="flex items-center gap-2 mb-8">
            <h1 className="text-3xl font-bold text-blue-900">FINUCE</h1>
          </div>

          <h2 className="text-3xl text-blue-900 font-light mb-6">
            Verifies in your browser that you are on{" "}
            <span className="font-semibold">FINUCE.</span>
          </h2>

          <div className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm mb-12 shadow-sm">
            <span>🔒</span> https://web.finuce.edu.ec
          </div>

          {/* Ilustración Controlada */}
          <div className="relative flex justify-center">
            <div className="w-72 h-72 bg-blue-100/40 rounded-full absolute -bottom-10 animate-pulse"></div>
            <span className="text-[150px] relative z-10">🛡️</span>
          </div>

          <div className="mt-20 space-y-3 text-sm text-gray-500">
            <p>01. Protect your username and password</p>
            <p>02. Verifies always the security lock</p>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: El Formulario */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-6">
        <div className="w-full max-w-[420px]">
          {/* El componente LoginForm o RegisterForm aquí */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            {formType === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>

        {/* Footer pequeño */}
        <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-widest">
          © 2026 FINUCE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}
