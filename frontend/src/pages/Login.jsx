import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "/Users/FostDull/Documents/Universidadt/PW/FIN-UCE-main/FIN-UCE-main/src/lib/supabase";

import AuthLayout from "../layouts/AuthLayout";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthLayout />;
}
