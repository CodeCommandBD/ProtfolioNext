"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { useTheme } from "styled-components";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = ({ color, ...props }) => {
  const ref = useRef(null);
  const [sphere] = React.useState(() =>
    random.inSphere(new Float32Array(5001), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
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
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars color={starColor} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
