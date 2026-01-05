"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load heavy Three.js component
const StarsCanvas = dynamic(() => import("@/components/canvas/Stars"), {
  ssr: false,
  loading: () => null,
});

export default function StarsWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Detect if mobile device
    const isMobile = window.innerWidth <= 768;

    // Delay Stars loading to improve LCP
    // Desktop: 1000ms, Mobile: 2000ms (mobile devices are slower)
    const delay = isMobile ? 2000 : 1000;

    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  // Don't render Stars until delay is complete
  if (!shouldLoad) return null;

  return <StarsCanvas />;
}
