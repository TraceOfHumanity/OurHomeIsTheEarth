import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";

import { EarthScene } from "./EarthScene";

export const Earth = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-screen">
      <Canvas>
        <ambientLight intensity={0.1} />
        <EarthScene />
      </Canvas>
      <Loader
        containerStyles={{
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};
