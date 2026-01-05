import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import styled from "styled-components";

const EarthCanvasWrapper = styled.div`
  width: 100%;
  height: 600px;
  max-width: 600px;
  margin: 60px auto 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    height: 400px;
    max-width: 400px;
    margin: 40px auto 0;
  }
`;

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  return (
    <primitive object={earth.scene} scale={3} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  return (
    <EarthCanvasWrapper>
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Earth />
          <Preload all />
        </Suspense>
      </Canvas>
    </EarthCanvasWrapper>
  );
};

export default EarthCanvas;
