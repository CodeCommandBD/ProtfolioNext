"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: transparent;
  z-index: 9999;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.primary} 0%,
    #b967ff 50%,
    ${({ theme }) => theme.primary} 100%
  );
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px ${({ theme }) => theme.primary};
`;

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);

    // Initial calculation
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ProgressBarContainer>
      <ProgressBarFill style={{ width: `${scrollProgress}%` }} />
    </ProgressBarContainer>
  );
};

export default ScrollProgress;
