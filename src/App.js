// client/src/App.js
import React, { useState, useEffect, useRef } from "react";
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
    ? process.env.REACT_APP_BACKEND_URL_PROD // In production, assume the backend is served from the same origin
    : process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

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

  // useRef to store the socket instance
  const socketRef = useRef(null);

  // useRef to store timeout IDs for cleanup
  const timeoutsRef = useRef([]);

  // Initialize Socket.IO connection inside useEffect
  useEffect(() => {
    // Initialize the socket with reconnection options
    socketRef.current = io(backendURL, {
      transports: ["websocket"],
      reconnectionAttempts: Infinity, // Unlimited reconnection attempts
      reconnectionDelay: 2000, // 2 seconds delay between attempts
    });

    const socket = socketRef.current;

    // Handle successful connection
    socket.on("connect", () => {
      setNotification({
        open: true,
        message: "Connected to the server.",
        severity: "success",
      });
    });

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

      // Redirect to Role Selection after a 2-second delay
      const timeoutId = setTimeout(() => {
        resetChatStates();
      }, 2000);
      timeoutsRef.current.push(timeoutId);
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

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      setNotification({
        open: true,
        message: "Disconnected from the server.",
        severity: "error",
      });

      // Wait for 3 seconds before resetting the states
      const timeoutId = setTimeout(() => {
        resetChatStates();
      }, 3000);
      timeoutsRef.current.push(timeoutId);
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
      // Capture the current timeouts in a local variable
      const timeouts = [...timeoutsRef.current];

      // Remove all event listeners
      socket.off("connect");
      socket.off("matched");
      socket.off("error_message");
      socket.off("burn_confession");
      socket.off("confession_burned");
      socket.off("participant_disconnected");
      socket.off("disconnect");
      socket.off("connect_error");

      // Disconnect the socket
      socket.disconnect();

      // Clear all pending timeouts using the captured timeouts
      timeouts.forEach((timeout) => clearTimeout(timeout));

      // Optionally, clear the timeoutsRef.current array
      timeoutsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to reset chat-related states
  const resetChatStates = () => {
    setRole(null);
    setMatched(false);
    setChatRole(null);
    setRoomId(null);
  };

  // Effect to attempt reconnection when role is null (redirected to RoleSelection)
  useEffect(() => {
    if (!role && socketRef.current) {
      // Attempt to reconnect if not already connected
      if (!socketRef.current.connected) {
        socketRef.current.connect();
      }
    }
  }, [role]);

  // Handler to select role and emit event to server
  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    socketRef.current.emit("select_role", selectedRole);
  };

  // Handler to redirect to Role Selection without disconnecting the socket
  const onBurnConfession = () => {
    resetChatStates();
    // socketRef.current.disconnect(); // Removed to allow reconnection
  };

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
              socket={socketRef.current}
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
