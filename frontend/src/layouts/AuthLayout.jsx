import { Box, Paper, Typography, Divider } from "@mui/material";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthLayout({ formType = "login" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        bgcolor: "#F4F6F8",
      }}
    >
      {/* LEFT — BRAND / TRUST (DESKTOP ONLY) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          px: 10,
          py: 7,
          bgcolor: "#FFFFFF",
          borderRight: "1px solid #E0E3E7",
        }}
      >
        {/* LOGO */}
        <Typography
          fontWeight="bold"
          fontSize={22}
          letterSpacing={1}
          color="#0A1F44"
        >
          FIN-UCE
        </Typography>

        {/* MESSAGE */}
        <Box>
          <Typography
            sx={{
              fontSize: 30,
              fontFamily: "serif",
              color: "#0A1F44",
              mb: 3,
              lineHeight: 1.35,
            }}
          >
            Always verify you are
            <br />
            accessing FinUCE securely.
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 3,
              py: 1.5,
              borderRadius: 999,
              bgcolor: "#F1F3F5",
              fontSize: 14,
              color: "#0A1F44",
              fontWeight: 500,
            }}
          >
            🔒 https://web.fin-uce.edu.ec
          </Box>

          {/* ILLUSTRATION PLACEHOLDER */}
          <Box
            sx={{
              width: 280,
              height: 280,
              bgcolor: "#EEF2F5",
              borderRadius: "50%",
              mt: 7,
              mx: "auto",
            }}
          />
        </Box>

        {/* FOOTER */}
        <Typography fontSize={12} color="text.secondary">
          © 2026 FIN-UCE. All rights reserved.
        </Typography>
      </Box>

      {/* RIGHT — AUTH FORM */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            bgcolor: "#FFFFFF",
          }}
        >
          {/* MOBILE HEADER */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              textAlign: "center",
              mb: 3,
            }}
          >
            <Typography fontWeight="bold" fontSize={20} color="#0A1F44">
              FIN-UCE
            </Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>

          {formType === "login" ? <LoginForm /> : <RegisterForm />}
        </Paper>
      </Box>
    </Box>
  );
}
