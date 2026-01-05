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

  &.visible {
    animation: ${({ $animationType }) =>
        $animationType === "fadeInUp" ? fadeInUp : fadeIn}
      ${({ $duration }) => $duration || "0.6s"} ease-out
      ${({ $delay }) => $delay || "0s"} forwards;
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
