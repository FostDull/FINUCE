import { Box } from "@mui/material";
import Sidebar from "../components/auth/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#EEF1F4",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* TOP BAR (opcional, pero recomendado) */}
        <Box
          sx={{
            height: 64,
            px: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#FFFFFF",
            borderBottom: "1px solid #E0E3E7",
          }}
        >
          {/* Page title placeholder */}
          <Box
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "#0A1F44",
            }}
          >
            Dashboard
          </Box>

          {/* User / notifications placeholder */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "#E6EBF0",
            }}
          />
        </Box>

        {/* PAGE CONTENT */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            overflowY: "auto",
            bgcolor: "#F4F6F8",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
