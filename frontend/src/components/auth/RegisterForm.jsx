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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" fontWeight="bold" color="#0A1F44" mb={1}>
        Create a new account
      </Typography>

      <Typography fontSize={14} color="text.secondary" mb={3}>
        It's quick and easy.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* First & Last Name */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="First name" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Last name" fullWidth />
        </Grid>
      </Grid>

      {/* Email */}
      <TextField label="Email address" type="email" fullWidth sx={{ mt: 2 }} />

      {/* Password */}
      <TextField
        label="New password"
        type="password"
        fullWidth
        sx={{ mt: 2 }}
      />

      <TextField
        label="Confirm password"
        type="password"
        fullWidth
        sx={{ mt: 2 }}
      />

      {/* Birthday */}
      <TextField
        label="Date of birth"
        type="date"
        fullWidth
        sx={{ mt: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      {/* Gender */}
      <FormControl sx={{ mt: 3 }}>
        <FormLabel>Gender</FormLabel>
        <RadioGroup row>
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
        sx={{
          mt: 3,
          bgcolor: "#42b72a",
          color: "#fff",
          fontWeight: "bold",
          py: 1.3,
          "&:hover": { bgcolor: "#36a420" },
        }}
      >
        Sign Up
      </Button>

      {/* Back */}
      <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>
        Already have an account?
      </Button>
    </>
  );
}
