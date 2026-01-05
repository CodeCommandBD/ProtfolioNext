"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

const PageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the complete rocket animation sequence
    // Total animation time: 2.4s (animation) + 0.5s (fade out buffer)
    const animationTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2900); // 2.9 seconds to ensure rocket fully exits

    return () => clearTimeout(animationTimer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {/* Only show children after loading is complete */}
      {!isLoading && children}
    </>
  );
};

export default PageLoader;
