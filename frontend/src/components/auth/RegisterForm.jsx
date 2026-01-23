import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

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

    // ✅ El account se crea automáticamente por el trigger
    navigate("/dashboard");
  };

  return (
    <Box maxWidth={420}>
      <Typography variant="h4" fontWeight="bold" color="#0A1F44" mb={1}>
        Create a new account
      </Typography>

      <Typography fontSize={14} color="text.secondary" mb={3}>
        It's quick and easy.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* First & Last Name */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First name"
            name="firstName"
            fullWidth
            value={form.firstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last name"
            name="lastName"
            fullWidth
            value={form.lastName}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {/* Email */}
      <TextField
        label="Email address"
        name="email"
        type="email"
        fullWidth
        sx={{ mt: 2 }}
        value={form.email}
        onChange={handleChange}
      />

      {/* Password */}
      <TextField
        label="New password"
        name="password"
        type="password"
        fullWidth
        sx={{ mt: 2 }}
        value={form.password}
        onChange={handleChange}
      />

      <TextField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        fullWidth
        sx={{ mt: 2 }}
        value={form.confirmPassword}
        onChange={handleChange}
      />

      {/* Birthday */}
      <TextField
        label="Date of birth"
        name="birthdate"
        type="date"
        fullWidth
        sx={{ mt: 2 }}
        InputLabelProps={{ shrink: true }}
        value={form.birthdate}
        onChange={handleChange}
      />

      {/* Gender */}
      <FormControl sx={{ mt: 3 }}>
        <FormLabel>Gender</FormLabel>
        <RadioGroup
          row
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>

      {/* Terms */}
      <Typography fontSize={12} color="text.secondary" mt={3}>
        By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies
        Policy.
      </Typography>

      {/* Sign Up Button */}
      <Button
        fullWidth
        size="large"
        disabled={loading}
        onClick={handleSubmit}
        sx={{
          mt: 3,
          bgcolor: "#42b72a",
          color: "#fff",
          fontWeight: "bold",
          py: 1.3,
          "&:hover": { bgcolor: "#36a420" },
        }}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>

      {/* Back */}
      <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>
        Already have an account?
      </Button>
    </Box>
  );
}
