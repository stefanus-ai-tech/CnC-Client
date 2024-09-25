// client/src/components/RoleSelection.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import './RoleSelection.css'; // Import the CSS file for styles

// Styled Button with Goudy Bookletter 1911 font and no uppercase transformation
// Inside RoleSelection.js

const StyledButton = styled(Button)(({ theme }) => ({
  width: '120px', // Keep fixed width
  height: '50px',
  margin: '10px',
  fontSize: '18px', // Increased font size
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '8px',
  fontFamily: 'Goudy Bookletter 1911, serif', // Updated font
  textTransform: 'none', // Prevents uppercase transformation
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px', // Smaller font size for mobile
    width: '100%', // Full width on mobile
    maxWidth: '300px',
  },
}));

const quotes = [
  '"Come as you are, no judgment here"',
  '"Let today be the day you find peace within yourself."',
];

const animatedTitle = ['Welcome', 'to', 'the', 'Sanctuary', 'of', 'Confession']; // Removed trailing spaces

// Styled Typography with responsive font size and IM Fell English font
const AnimatedTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'IM Fell English, serif', // Updated font
  fontSize: '4em', // Adjusted font size
  maxWidth: '780px', // Reduced width for the title container
  margin: '20px auto 50px auto', // Increased bottom margin for spacing
  textAlign: 'center',
  animation: 'scale 3s forwards cubic-bezier(0.5, 1, 0.89, 1)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.3em', // Smaller size for small screens
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '4em', // Larger size for medium and up
  },
}));

const RoleSelection = ({ selectRole }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150); // Initial typing speed
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false); // New state
  const [buttonsVisible, setButtonsVisible] = useState(false); // New state for buttons visibility

  // Effect to set titleAnimationComplete after animation + delay
  useEffect(() => {
    const titleAnimationDuration = 3000; // 3 seconds for scale animation
    const delayAfterAnimation = 750; // 0.75 seconds delay
    const totalDelay = titleAnimationDuration + delayAfterAnimation;

    const timer = setTimeout(() => {
      setTitleAnimationComplete(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect only starts after title animation is complete
  useEffect(() => {
    if (!titleAnimationComplete) return;

    const handleType = () => {
      const currentQuote = quotes[currentQuoteIndex];
      const fullText = currentQuote;

      setDisplayedText((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );

      // Adjust typing speed for deleting
      setTypingSpeed(isDeleting ? 75 : 150);

      // If the text is fully typed
      if (!isDeleting && displayedText === fullText) {
        // Pause before starting to delete
        setTimeout(() => setIsDeleting(true), 2000);

        // After the first quote is fully displayed, trigger buttons fade-in
        if (currentQuoteIndex === 0) {
          setTimeout(() => setButtonsVisible(true), 750); // 0.75 seconds delay
        }
      }
      // If the text is fully deleted down to the first quotation mark
      else if (isDeleting && displayedText === '"') {
        setIsDeleting(false);
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);

    return () => clearTimeout(timer);
  }, [
    displayedText,
    isDeleting,
    typingSpeed,
    currentQuoteIndex,
    titleAnimationComplete,
  ]);

  return (
    <Container maxWidth="md" className="role-selection-container">
      {/* Animated Title */}
      <AnimatedTitle component="h1" className="animated-title">
        {animatedTitle.map((word, index) => (
          <span
            key={index}
            style={{
              animationDelay: `${0.1 + index * 0.2}s`,
            }}>
            {word}
          </span>
        ))}
      </AnimatedTitle>

      {/* Quotes Container */}
      {titleAnimationComplete && (
        <Box className="quotes-container">
          <Typography className="typewriter-text">{displayedText}</Typography>
        </Box> /*don't add any cursor */
      )}

      {/* Action Buttons */}
      <Box className={`buttons-container ${buttonsVisible ? 'visible' : ''}`}>
        <StyledButton
          variant="contained"
          style={{ backgroundColor: '#551606' }}
          onClick={() => selectRole('confessor')}>
          Confessor
        </StyledButton>
        <StyledButton
          variant="contained"
          style={{ backgroundColor: '#f5eded', color: '#000' }}
          onClick={() => selectRole('listener')}>
          Listener
        </StyledButton>
      </Box>
    </Container>
  );
};

export default RoleSelection;
