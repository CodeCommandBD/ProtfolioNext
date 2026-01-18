"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/lib/redux/slices/themeSlice";
import { useTheme } from "next-themes";
import styled from "styled-components";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";

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

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const reduxTheme = useSelector((state) => state.theme.mode);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Sync Redux state with next-themes
  React.useEffect(() => {
    if (mounted && theme !== reduxTheme) {
      setTheme(reduxTheme);
    }
  }, [reduxTheme, theme, setTheme, mounted]);

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ToggleButton
      onClick={handleToggle}
      aria-label={`Switch to ${reduxTheme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${reduxTheme === "dark" ? "light" : "dark"} mode`}
    >
      {reduxTheme === "dark" ? <BsFillSunFill /> : <BsFillMoonStarsFill />}
    </ToggleButton>
  );
};

export default ThemeToggle;
