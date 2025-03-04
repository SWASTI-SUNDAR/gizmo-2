import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

export const ThreeSoluteCubes = ({
  dissolved,
  isResetting,
  isSugar,
  rotationAngle,
}) => {
  // If it's not sugar (i.e., it's sand), don't render anything
  if (!isSugar) {
    return null;
  }

  // Only render sugar cubes
  return (
    <group>
      <SoluteCube
        dissolved={dissolved}
        isResetting={isResetting}
        position={[-0.5, 0, 0]}
        rotationAngle={rotationAngle}
      />
      <SoluteCube
        dissolved={dissolved}
        isResetting={isResetting}
        position={[0.5, 0, 0]}
        rotationAngle={rotationAngle}
      />
      <SoluteCube
        dissolved={dissolved}
        isResetting={isResetting}
        position={[0, 0, 0.3]}
        rotationAngle={rotationAngle}
      />
    </group>
  );
};

const SoluteCube = ({
  dissolved,
  isResetting,
  position = [0, 0, 0],
  rotationAngle = 0,
}) => {
  const scale = isResetting ? 1 : 1 - dissolved;
  const groupRef = useRef();

  // Load textures
  const sugarTexture = useLoader(TextureLoader, "sugar.png");

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationAngle;
    }
  }, [rotationAngle]);

  const isVisible = scale > 0.05;

  return (
    <group
      ref={groupRef}
      scale={[scale, scale, scale]}
      position={position}
      visible={isVisible}
    >
      {/* Sugar crystal (White) */}
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial
          // map={sugarTexture}
          color="#d9d9d9" // Pure white
          emissive="#DDDDDD"
          opacity={"0.3"}
          emissiveIntensity={1}
          roughness={1}
          metalness={1}
        />
      </mesh>
    </group>
  );
};

export default SoluteCube;
