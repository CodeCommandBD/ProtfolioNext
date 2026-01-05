'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import styled from 'styled-components';
import { BsFillSunFill, BsFillMoonStarsFill } from 'react-icons/bs';

const ToggleButton = styled.button`
  background: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(133, 76, 230, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    color: white;
    font-size: 20px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(20deg);
  }

  @media screen and (max-width: 768px) {
    width: 36px;
    height: 36px;
    
    svg {
      font-size: 18px;
    }
  }
`;

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ToggleButton
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <BsFillSunFill /> : <BsFillMoonStarsFill />}
    </ToggleButton>
  );
};

export default ThemeToggle;
