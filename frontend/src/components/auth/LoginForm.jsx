import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">
        Welcome to FINUCE
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            User / Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none"
          />
          <div className="text-right text-xs text-blue-600 mt-1 cursor-pointer">
            Forgot your username?
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none"
          />
          <div className="text-right text-xs text-blue-600 mt-1 cursor-pointer">
            Forgot your password?
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#FFF082] hover:bg-yellow-300 text-gray-700 font-medium py-2 rounded-md transition mt-4"
        >
          {loading ? "Entering..." : "Enter"}
        </button>

        {/* DIVIDER */}
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-xs uppercase">O</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* GOOGLE BUTTON - IMPORTANTE: h-5 y w-5 para que no sea gigante */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-gray-700"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5 object-contain"
            alt="Google"
          />
          <span>Continue with Google</span>
        </button>
      </div>

      {/* ACTION CARDS (ESTILO PICHINCHA) */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg text-center bg-gray-50/50">
          <span className="text-xl mb-1">🔓</span>
          <p className="text-[10px] font-bold text-gray-700 leading-tight">
            Account blocked?
            <br />
            <span className="font-normal text-blue-600">Unlock it here</span>
          </p>
        </div>
        <div
          onClick={() => navigate("/register")}
          className="flex flex-col items-center p-4 border border-gray-100 rounded-lg text-center bg-gray-50/50 cursor-pointer"
        >
          <span className="text-xl mb-1">👤</span>
          <p className="text-[10px] font-bold text-gray-700 leading-tight">
            New user?
            <br />
            <span className="font-normal text-blue-600">Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
}
