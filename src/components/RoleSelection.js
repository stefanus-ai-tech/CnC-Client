// client/src/components/RoleSelection.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import './RoleSelection.css'; // Import the CSS file for styles

const StyledButton = styled(Button)(({ theme }) => ({
  width: '120px',
  height: '50px',
  margin: '10px',
  fontSize: '16px',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '8px',
}));

const quotes = [
  'Come as you are, no judgment here',
  'Let today be the day you find peace within yourself.',
];

const animatedTitle = ['Welcome', 'to', 'the', 'Sanctuary', 'of', 'Confession']; // Removed trailing spaces

// Styled Typography with responsive font size
const AnimatedTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '3.5em', // Adjust as needed
  maxWidth: '100%',
  margin: '0 auto 20px auto',
  textAlign: 'center',
  animation: 'scale 3s forwards cubic-bezier(0.5, 1, 0.89, 1)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2em', // Smaller size for small screens
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

  // Effect to set titleAnimationComplete after animation + delay
  useEffect(() => {
    const titleAnimationDuration = 3000; // 3 seconds for scale animation
    const delayAfterAnimation = 750; // 0.7 seconds delay
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
      }
      // If the text is fully deleted
      else if (isDeleting && displayedText === '') {
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
    <Container maxWidth="sm" className="role-selection-container">
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

      {/* Typewriter Quote */}
      {titleAnimationComplete && (
        <Typography className="typewriter-text">
          {displayedText}
          <span className="cursor">|</span>
        </Typography>
      )}

      {/* Action Buttons */}
      <Box>
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
