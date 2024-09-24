// client/src/App.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import RoleSelection from "./components/RoleSelection";
import ChatWindow from "./components/ChatWindow";
import DisclaimerModal from "./components/DisclaimerModal"; // New component
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  CircularProgress,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

// Determine backend URL based on environment
const backendURL =
  process.env.NODE_ENV === "production"
    ? window.location.origin // In production, assume the backend is served from the same origin
    : process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

// Initialize Socket.IO connection
const socket = io(backendURL, {
  transports: ["websocket"], // Optional: Specify transports if needed
});

// Define your theme here
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

function App() {
  const [role, setRole] = useState(null);
  const [matched, setMatched] = useState(false);
  const [chatRole, setChatRole] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [error, setError] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(true); // State for disclaimer modal
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Handler to select role and emit event to server
  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    socket.emit("select_role", selectedRole);
  };

  // Handler to redirect to Role Selection and disconnect socket
  const onBurnConfession = async () => {
    setRole(null);
    setMatched(false);
    setChatRole(null);
    setRoomId(null);

    socket.disconnect(); // Disconnect the socket after the delay
  };

  // Listen for events from the server
  useEffect(() => {
    // Handle successful match
    socket.on("matched", (data) => {
      setChatRole(data.role);
      setRoomId(data.roomId);
      setMatched(true);
      setNotification({
        open: true,
        message: "You have been matched!",
        severity: "success",
      });
    });

    // Handle error messages
    socket.on("error_message", (msg) => {
      setError(msg);
      setNotification({ open: true, message: msg, severity: "error" });
    });

    // Handle confession being burned (confessor's side)
    socket.on("burn_confession", () => {
      setNotification({
        open: true,
        message: "Your confession has been burned.",
        severity: "warning",
      });
      // No redirection here; handled by ChatWindow via onBurnConfession
    });

    // Handle confession burned notification on listener's side
    socket.on("confession_burned", () => {
      setNotification({
        open: true,
        message: "Confession has been burned.",
        severity: "info",
      });
      // No redirection here; handled by ChatWindow via onBurnConfession
    });

    // Handle participant disconnection
    socket.on("participant_disconnected", () => {
      setNotification({
        open: true,
        message: "Your chat partner has disconnected.",
        severity: "warning",
      });
      // Redirection handled by ChatWindow if necessary
    });

    // Handle connection status
    socket.on("connect", () => {
      setNotification({
        open: true,
        message: "Connected to the server.",
        severity: "success",
      });
    });

    socket.on("disconnect", async (reason) => {
      setNotification({
        open: true,
        message: "Disconnected from the server.",
        severity: "error",
      });

      // Wait for 2 seconds before resetting the states
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Reset states after the delay to trigger redirection
      setMatched(false);
      setRoomId(null);
      setChatRole(null);
      setRole(null); // Redirect to Role Selection after delay
    });
    // Handle socket connection errors
    socket.on("connect_error", (err) => {
      setError("Connection failed. Please try again.");
      setNotification({
        open: true,
        message: "Connection failed. Please try again.",
        severity: "error",
      });
      console.error("Connection Error:", err);
    });

    // Cleanup on unmount
    return () => {
      socket.off("matched");
      socket.off("error_message");
      socket.off("burn_confession");
      socket.off("confession_burned");
      socket.off("participant_disconnected");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  // Handle closing of notifications
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Handle disclaimer acknowledgment
  const handleAcknowledgeDisclaimer = () => {
    setShowDisclaimer(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Disclaimer Modal */}
      <DisclaimerModal
        open={showDisclaimer}
        onAcknowledge={handleAcknowledgeDisclaimer}
      />

      {/* Main Content */}
      {!showDisclaimer && (
        <>
          {!role ? (
            <RoleSelection selectRole={selectRole} />
          ) : !matched ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                color: "#fff",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Waiting for a match...
              </Typography>
              <CircularProgress color="error" />
            </Box>
          ) : (
            <ChatWindow
              socket={socket}
              role={chatRole}
              roomId={roomId}
              onBurnConfession={onBurnConfession}
            />
          )}
        </>
      )}

      {/* Error Notification */}
      {error && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "error.main",
            color: "#fff",
            px: 2,
            py: 1,
            borderRadius: "4px",
          }}
        >
          {error}
        </Box>
      )}

      {/* Snackbar Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
