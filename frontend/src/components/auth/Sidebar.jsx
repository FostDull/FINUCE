import { Box, Button, Divider, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navButton = (label, path) => (
    <Button
      fullWidth
      onClick={() => navigate(path)}
      sx={{
        justifyContent: "flex-start",
        py: 1.4,
        px: 2,
        mb: 0.5,
        textTransform: "none",
        fontWeight: isActive(path) ? "bold" : "normal",
        bgcolor: isActive(path) ? "#E3F2FD" : "transparent",
        color: "#0A1F44",
        borderRadius: 1,
        "&:hover": {
          bgcolor: "#E3F2FD",
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "#FFFFFF",
        borderRight: "1px solid #E0E0E0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        px: 2,
        py: 3,
      }}
    >
      {/* TOP */}
      <Box>
        <Typography fontWeight="bold" fontSize={20} mb={3} color="#0A1F44">
          FIN-UCE
        </Typography>

        {navButton("Home", "/dashboard")}
        {navButton("Send Money", "/dashboard/send")}
        {navButton("Transactions", "/dashboard/transactions")}
        {navButton("Payment Method", "/dashboard/payments")}
      </Box>

      {/* BOTTOM */}
      <Box>
        <Divider sx={{ my: 2 }} />

        {navButton("Configuration", "/dashboard/config")}

        <Button
          fullWidth
          sx={{
            justifyContent: "flex-start",
            py: 1.4,
            px: 2,
            mt: 1,
            textTransform: "none",
            color: "#B71C1C",
            "&:hover": {
              bgcolor: "#FDECEA",
            },
          }}
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/");
          }}
        >
          Log out
        </Button>
      </Box>
    </Box>
  );
}
