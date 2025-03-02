import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

export const ThreeSoluteCubes = ({
  dissolved,
  isResetting,
  isSugar,
  rotationAngle,
}) => (
  <group>
    <SoluteCube
      dissolved={dissolved}
      isResetting={isResetting}
      isSugar={isSugar}
      position={[-0.5, 0, 0]}
      rotationAngle={rotationAngle}
    />
    <SoluteCube
      dissolved={dissolved}
      isResetting={isResetting}
      isSugar={isSugar}
      position={[0.5, 0, 0]}
      rotationAngle={rotationAngle}
    />
    <SoluteCube
      dissolved={dissolved}
      isResetting={isResetting}
      isSugar={isSugar}
      position={[0, 0, 0.3]}
      rotationAngle={rotationAngle}
    />
  </group>
);



const SoluteCube = ({
  dissolved,
  isResetting,
  isSugar,
  position = [0, 0, 0],
  rotationAngle = 0,
}) => {
  const scale = isResetting ? 1 : 1 - dissolved;
  const groupRef = useRef();

  // Load textures
  const sugarTexture = useLoader(TextureLoader, "sugar.png");
  const saltTexture = useLoader(TextureLoader, "salt.png");

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationAngle;
    }
  }, [rotationAngle]);

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={position}>
      {isSugar ? (
        // More realistic sugar crystal (White)
        <mesh>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            // map={sugarTexture}
            color="#FFFFFF" // Pure white
            emissive="#DDDDDD"
            opacity={1}
            emissiveIntensity={1}
            roughness={1}
            metalness={1}
          />
        </mesh>
      ) : (
        // More realistic salt crystal (Brown)
        <mesh>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial
            map={saltTexture}
            color="#8B4513" // Brown color for salt
            emissive="#5A2D0C"
            emissiveIntensity={0.15}
            roughness={0.3}
            metalness={0.1}
            transparent={false}
            opacity={1}
          />
        </mesh>
      )}
      <lineSegments>
        <boxGeometry
          args={[
            isSugar ? 0.42 : 0.27,
            isSugar ? 0.42 : 0.27,
            isSugar ? 0.42 : 0.27,
          ]}
        />
        <lineBasicMaterial color="#000000" linewidth={2} />
      </lineSegments>
    </group>
  );
};

export default SoluteCube;

