"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { useTheme } from "styled-components";

const Stars = ({ color, ...props }) => {
  const ref = useRef(null);
  const [sphere] = React.useState(() => {
    // Pure mathematical sphere generation
    const numStars = 600; // 600 stars * 3 coordinates = 1800 total values
    const positions = new Float32Array(numStars * 3);

    for (let i = 0; i < positions.length; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.cbrt(Math.random()) * 1.2;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    // Validate - check for any NaN
    const hasInvalid = positions.some((v) => !isFinite(v));
    if (hasInvalid) {
      console.error("Generated positions contain NaN/Infinity!");
    }

    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02;
      ref.current.rotation.y -= delta * 0.01;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={color}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const theme = useTheme();
  // Use dark dots for light backgrounds, light dots for dark backgrounds
  const starColor = theme.bg === "#FFFFFF" ? "#1a1a1a" : "#ffffff";

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        position: "absolute",
        inset: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={1}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Stars color={starColor} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
