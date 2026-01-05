"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedContainer = styled.div`
  opacity: 0;
  will-change: opacity, transform;

  &.visible {
    animation: ${({ $animationType }) =>
        $animationType === "fadeInUp" ? fadeInUp : fadeIn}
      ${({ $duration }) => $duration || "0.6s"}
      cubic-bezier(0.25, 0.46, 0.45, 0.94) ${({ $delay }) => $delay || "0s"}
      forwards;
  }
`;

const AnimatedSection = ({
  children,
  animationType = "fadeInUp",
  duration = "0.6s",
  delay = "0s",
  ...props
}) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <AnimatedContainer
      ref={ref}
      className={isVisible ? "visible" : ""}
      $animationType={animationType}
      $duration={duration}
      $delay={delay}
      {...props}
    >
      {children}
    </AnimatedContainer>
  );
};

export default AnimatedSection;
