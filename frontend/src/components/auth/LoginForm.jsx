import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Link,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 EMAIL / PASSWORD LOGIN
  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  // 🔐 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <>
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h5" fontFamily="serif" color="#0A1F44">
          Welcome back
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Sign in to access your FinUCE account
        </Typography>
      </Box>

      {/* EMAIL */}
      <TextField
        label="Email address"
        placeholder="you@example.com"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "#FFFFFF",
          },
        }}
      />

      {/* PASSWORD */}
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "#FFFFFF",
          },
        }}
      />

      {/* FORGOT PASSWORD */}
      <Box textAlign="right" mt={1} mb={3}>
        <Link underline="hover" fontSize={13}>
          Forgot your password?
        </Link>
      </Box>

      {/* SIGN IN */}
      <Button
        fullWidth
        size="large"
        disabled={loading}
        sx={{
          bgcolor: "#0A1F44",
          color: "#FFFFFF",
          py: 1.6,
          fontWeight: "bold",
          borderRadius: 2,
          "&:hover": { bgcolor: "#091833" },
        }}
        onClick={handleLogin}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      {/* DIVIDER */}
      <Box my={3}>
        <Divider>
          <Typography fontSize={12} color="text.secondary">
            OR
          </Typography>
        </Divider>
      </Box>

      {/* GOOGLE LOGIN */}
      <Button
        fullWidth
        variant="outlined"
        sx={{
          py: 1.4,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 500,
        }}
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </Button>

      {/* ACTION CARDS */}
      <Grid container spacing={2} mt={3}>
        <Grid item xs={6}>
          <Button variant="outlined" fullWidth sx={{ py: 2, borderRadius: 2 }}>
            <LockOutlinedIcon fontSize="small" />
            <Box ml={1} textAlign="left">
              <Typography fontWeight="bold" fontSize={13}>
                Account locked?
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Unlock access
              </Typography>
            </Box>
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ py: 2, borderRadius: 2 }}
            onClick={() => navigate("/register")}
          >
            <PersonOutlineIcon fontSize="small" />
            <Box ml={1} textAlign="left">
              <Typography fontWeight="bold" fontSize={13}>
                New user?
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Create account
              </Typography>
            </Box>
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
