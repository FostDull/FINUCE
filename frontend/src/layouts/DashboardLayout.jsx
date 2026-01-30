import { Box, Typography } from "@mui/material";
import Sidebar from "../components/auth/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
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
        }}
      >
        {/* TOP BAR */}
        <Box
          sx={{
            height: 64,
            px: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#0F172A",
            }}
          >
            FIN-UCE Dashboard
          </Typography>

          {/* Avatar */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "#E0E7FF",
            }}
          />
        </Box>

        {/* PAGE CONTENT */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
