import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    gender: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          gender: form.gender,
          birthdate: form.birthdate,
        },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate("/dashboard");
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-[#0A1F44] font-medium placeholder:text-gray-400";

  const labelClass = "block text-sm font-semibold text-[#0A1F44] mb-1";

  return (
    <div className="max-w-[420px] w-full mx-auto p-2">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0A1F44] tracking-tight">
          Create a new account
        </h1>
        <p className="text-gray-500 text-sm mt-1">It's quick and easy.</p>
      </div>

      <div className="h-[1px] bg-gray-200 w-full mb-6" />

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <svg
            className="w-5 h-5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* NAME GRID */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={labelClass}>First name</label>
            <input
              type="text"
              name="firstName"
              className={inputClass}
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Last name</label>
            <input
              type="text"
              name="lastName"
              className={inputClass}
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className={labelClass}>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            className={inputClass}
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>New password</label>
            <input
              type="password"
              name="password"
              className={inputClass}
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={labelClass}>Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              className={inputClass}
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* BIRTHDATE */}
        <div>
          <label className={labelClass}>Date of birth</label>
          <input
            type="date"
            name="birthdate"
            className={inputClass}
            value={form.birthdate}
            onChange={handleChange}
          />
        </div>

        {/* GENDER - Custom Radio Group */}
        <div>
          <label className={labelClass}>Gender</label>
          <div className="flex gap-4">
            {["female", "male", "other"].map((option) => (
              <label
                key={option}
                className="flex flex-1 items-center justify-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition uppercase text-xs font-bold text-gray-600 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:text-blue-700"
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  className="hidden"
                  checked={form.gender === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* TERMS */}
      <p className="text-[11px] text-gray-500 mt-6 leading-relaxed">
        By clicking Sign Up, you agree to our{" "}
        <span className="text-blue-600 cursor-pointer">Terms</span>,{" "}
        <span className="text-blue-600 cursor-pointer">Privacy Policy</span> and{" "}
        <span className="text-blue-600 cursor-pointer">Cookies Policy</span>.
      </p>

      {/* SIGN UP BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4 bg-[#42b72a] hover:bg-[#36a420] text-white font-bold py-3 rounded-lg text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      {/* BACK TO LOGIN */}
      <button
        onClick={() => navigate("/")}
        className="w-full mt-4 bg-blue-50 hover:bg-write-500 text-red-500 font-medium hover:underline text-sm py-2"
      >
        Already have an account?
      </button>
    </div>
  );
}
