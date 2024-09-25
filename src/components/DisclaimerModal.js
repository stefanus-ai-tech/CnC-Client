// client/src/components/DisclaimerModal.js
import React from 'react';
import { Modal, Box, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';

function DisclaimerModal({ open, onAcknowledge }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Define styles dynamically based on screen size
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '95%' : '90%', // Make the modal almost full screen on both mobile and PC
    height: isMobile ? '95%' : '90%', // Adjust height for full-screen experience
    maxWidth: '1200px', // Limit maximum width on larger screens
    bgcolor: '#0d0d0d', // Background color
    boxShadow: 24,
    overflowY: 'auto', // Allow scrolling if content is too large
    p: isMobile ? 4 : 6, // Increase padding to give more breathing room
    color: '#e5e5e5',
  };

  const titleStyle = {
    fontSize: isMobile ? '28px' : '48px', // Larger font for title
    color: '#551606',
    textAlign: 'center',
    fontFamily: "'IM Fell DW Pica', serif", // Applying IM FELL font
    marginBottom: '20px', // Add spacing below the title
  };

  const descriptionStyle = {
    marginTop: 2,
    color: '#f5eded',
    fontSize: isMobile ? '18px' : '24px', // Larger text for readability on bigger screens
    lineHeight: 1.8,
    fontFamily: "'Goudy Bookletter 1911', serif", // Applying Goudy font
  };

  return (
    <Modal
      open={open}
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-description">
      <Box sx={style}>
        <Typography
          id="disclaimer-title"
          variant="h6"
          component="h2"
          sx={titleStyle}>
          Disclaimer
        </Typography>
        <Typography id="disclaimer-description" sx={descriptionStyle}>
          By using <b>Confess & Connect</b>, you agree to protect your privacy
          by not sharing any sensitive or personally identifiable information
          such as your name, address, or financial details. You are fully
          responsible for the content you submit, and we are not liable for any
          consequences that may arise from your disclosures. In Solo Mode, your
          confession is automatically deleted after submission, with no data
          retention or caching. This platform is designed solely for emotional
          release and is not a substitute for professional mental health
          services, so we encourage you to seek professional help when
          necessary.
          <br />
          <br />
          Please use <b>Confess & Connect</b> respectfully, refraining from
          harassment or harmful content. By using this platform, you acknowledge
          and accept these terms, and while we aim to provide a safe space, your
          well-being should always come first.
        </Typography>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#551606',
              ':hover': { bgcolor: '#693131' },
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              fontFamily: "'Goudy Bookletter 1911', serif", // Applying Goudy font
              fontSize: isMobile ? '16px' : '20px', // Larger button text
              padding: isMobile ? '10px 20px' : '15px 30px',
            }}
            onClick={onAcknowledge}>
            I Agree
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DisclaimerModal;
