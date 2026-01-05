"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const vibrate = keyframes`
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-2px) rotate(-1deg); }
  50% { transform: translateX(2px) rotate(1deg); }
  75% { transform: translateX(-2px) rotate(-1deg); }
`;

const flameFlicker = keyframes`
  0%, 100% { 
    opacity: 1; 
    transform: scaleY(1) scaleX(1);
  }
  25% { 
    opacity: 0.9; 
    transform: scaleY(1.3) scaleX(0.9);
  }
  50% { 
    opacity: 0.8; 
    transform: scaleY(1.1) scaleX(1.1);
  }
  75% { 
    opacity: 0.95; 
    transform: scaleY(1.2) scaleX(0.95);
  }
`;

const smokeRise = keyframes`
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-50px) scale(1.5);
    opacity: 0;
  }
`;

const LoaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  z-index: 9999;
  overflow: hidden;
`;

const RocketSVG = styled(motion.svg)`
  width: 150px;
  height: 150px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const Flame = styled(motion.g)`
  animation: ${flameFlicker} 0.15s infinite;
  transform-origin: center top;
`;

const SmokeParticle = styled(motion.div)`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: radial-gradient(
    circle,
    rgba(200, 200, 200, 0.6) 0%,
    rgba(150, 150, 150, 0) 70%
  );
  border-radius: 50%;
  animation: ${smokeRise} ${(props) => props.duration}s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  left: 50%;
  bottom: ${(props) => props.bottom}%;
  margin-left: ${(props) => props.offset}px;
`;

const SmokeContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const LoadingText = styled(motion.p)`
  margin-top: 32px;
  font-size: 24px;
  color: white;
  font-weight: 600;
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ProgressBar = styled(motion.div)`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 16px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff5722, #ffc107, #ff5722);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: ${(props) => props.opacity};
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  box-shadow: 0 0 ${(props) => props.opacity * 3}px white;
`;

const StarsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const starPositions = [
  { top: 10, left: 20, opacity: 0.8 },
  { top: 15, left: 80, opacity: 0.6 },
  { top: 25, left: 15, opacity: 0.9 },
  { top: 30, left: 70, opacity: 0.7 },
  { top: 40, left: 30, opacity: 0.8 },
  { top: 45, left: 85, opacity: 0.6 },
  { top: 50, left: 10, opacity: 0.9 },
  { top: 55, left: 60, opacity: 0.7 },
  { top: 60, left: 40, opacity: 0.8 },
  { top: 65, left: 90, opacity: 0.6 },
  { top: 70, left: 25, opacity: 0.9 },
  { top: 75, left: 75, opacity: 0.7 },
  { top: 80, left: 50, opacity: 0.8 },
  { top: 85, left: 35, opacity: 0.6 },
  { top: 90, left: 65, opacity: 0.9 },
];

const smokeParticles = [
  { size: 20, duration: 2, delay: 0, offset: -10, bottom: 35 },
  { size: 25, duration: 2.2, delay: 0.3, offset: 5, bottom: 35 },
  { size: 18, duration: 1.8, delay: 0.6, offset: -5, bottom: 35 },
  { size: 22, duration: 2.1, delay: 0.9, offset: 8, bottom: 35 },
  { size: 24, duration: 2.3, delay: 1.2, offset: -8, bottom: 35 },
];

const LoadingScreen = () => {
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Optimized timeline for better performance
    const timeline = [
      { delay: 0, stage: "liftup", duration: 600 }, // 0-0.6s
      { delay: 600, stage: "warmup", duration: 700 }, // 0.6-1.3s
      { delay: 1300, stage: "blastoff", duration: 500 }, // 1.3-1.8s
      { delay: 1800, stage: "exit", duration: 0 }, // 1.8s
    ];

    timeline.forEach(({ delay, stage: newStage }) => {
      setTimeout(() => setStage(newStage), delay);
    });

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / 18; // Complete in ~1.8s
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  const getRocketAnimation = () => {
    switch (stage) {
      case "liftup":
        return {
          y: [100, 0],
          transition: { duration: 0.6, ease: "easeOut" },
        };
      case "warmup":
        return {
          y: 0,
          x: [-2, 2, -2, 2, 0],
          rotate: [-1, 1, -1, 1, 0],
          transition: { duration: 0.35, repeat: 2 },
        };
      case "blastoff":
        return {
          y: -1000,
          scale: 1.2,
          transition: { duration: 0.5, ease: "easeIn" },
        };
      default:
        return { y: 100 };
    }
  };

  const getLoadingText = () => {
    switch (stage) {
      case "liftup":
        return "INITIALIZING...";
      case "warmup":
        return "WARMING UP...";
      case "blastoff":
        return "BLAST OFF!";
      default:
        return "LOADING...";
    }
  };

  const showFlame = stage === "warmup" || stage === "blastoff";
  const showSmoke = stage === "warmup" || stage === "blastoff";

  return (
    <LoaderContainer
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "exit" ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StarsContainer>
        {starPositions.map((star, index) => (
          <Star
            key={index}
            top={star.top}
            left={star.left}
            opacity={star.opacity}
          />
        ))}
      </StarsContainer>

      {showSmoke && (
        <SmokeContainer>
          {smokeParticles.map((particle, index) => (
            <SmokeParticle
              key={index}
              size={particle.size}
              duration={particle.duration}
              delay={particle.delay}
              offset={particle.offset}
              bottom={particle.bottom}
            />
          ))}
        </SmokeContainer>
      )}

      <RocketSVG viewBox="0 0 100 100" animate={getRocketAnimation()}>
        {/* Rocket Body */}
        <ellipse cx="50" cy="45" rx="15" ry="25" fill="#E8E8E8" />

        {/* Rocket Nose */}
        <path d="M 50 15 L 35 30 L 65 30 Z" fill="#5A6C7D" />

        {/* Window */}
        <circle
          cx="50"
          cy="40"
          r="8"
          fill="#4FC3F7"
          stroke="#2196F3"
          strokeWidth="2"
        />

        {/* Left Fin */}
        <path d="M 35 55 L 30 75 L 35 70 Z" fill="#5A6C7D" />

        {/* Right Fin */}
        <path d="M 65 55 L 70 75 L 65 70 Z" fill="#5A6C7D" />

        {/* Enhanced Flame Effect */}
        {showFlame && (
          <Flame>
            {/* Outer flame - Red/Orange */}
            <path
              d="M 45 70 L 40 90 L 45 85 L 50 92 L 55 85 L 60 90 L 55 70 Z"
              fill="#FF5722"
              opacity="0.9"
            />
            {/* Middle flame - Orange/Yellow */}
            <path
              d="M 46 72 L 43 88 L 47 83 L 50 88 L 53 83 L 57 88 L 54 72 Z"
              fill="#FF9800"
              opacity="0.8"
            />
            {/* Inner flame - Yellow/White */}
            <path
              d="M 47 74 L 45 85 L 48 81 L 50 85 L 52 81 L 55 85 L 53 74 Z"
              fill="#FFC107"
              opacity="0.9"
            />
            {/* Core flame - Bright Yellow */}
            <path
              d="M 48 76 L 47 82 L 50 80 L 53 82 L 52 76 Z"
              fill="#FFEB3B"
              opacity="1"
            />
          </Flame>
        )}
      </RocketSVG>

      <LoadingText
        key={stage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getLoadingText()}
      </LoadingText>

      <ProgressBar>
        <ProgressFill
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </ProgressBar>
    </LoaderContainer>
  );
};

export default LoadingScreen;
