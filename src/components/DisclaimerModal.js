// client/src/components/DisclaimerModal.js
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function DisclaimerModal({ open, onAcknowledge }) {
  return (
    <Modal
      open={open}
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-description"
    >
      <Box sx={style}>
        <Typography id="disclaimer-title" variant="h6" component="h2">
          Disclaimer
        </Typography>
        <Typography id="disclaimer-description" sx={{ mt: 2 }}>
          By using this application, you agree to our terms and conditions.
          Please ensure you understand the implications before proceeding.
        </Typography>
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Button variant="contained" color="primary" onClick={onAcknowledge}>
            I Understand
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DisclaimerModal;
