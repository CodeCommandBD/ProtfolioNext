"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

const PageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Optimized animation time for better performance
    // Total: 0.8s (reduced from 2.0s for faster LCP)
    const animationTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

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
