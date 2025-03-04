import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SimulationTabs } from "../components/SimulationTabs";
import { SimulationControls } from "../components/SimulationControls";
import { liquidVertexShader } from "../components/LiquidShaders";
import { liquidFragmentShader } from "../components/LiquidShaders";
import { ThreeSoluteCubes } from "../components/ThreeSoluteCubes";
import { ExperimentContext } from "../context/Context";

// Main Component
const DissolvingSolidsSimulation = () => {
  const [stirringSpeed, setStirringSpeed] = useState(1);
  const [temperature, setTemperature] = useState(25);
  const [isSugar, setIsSugar] = useState(true);
  const [dissolved, setDissolved] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isStirring, setIsStirring] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [data, setData] = useState([]);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const dissolutionCompleted = dissolved >= 1;

  const startStirringAnimation = () => {
    setIsStirring(true);
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      // Update rotation continuously
      setRotationAngle((prevAngle) => prevAngle + stirringSpeed * 0.02);

      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startStirringAnimation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stirringSpeed]);

  const resetSimulation = () => {
    setIsResetting(true);
    setTimeout(() => {
      setDissolved(0);
      setIsResetting(false);
      startTimeRef.current = Date.now();
    }, 2000);
  };

  // Effect to handle dissolution based on temperature and stirring speed
  useEffect(() => {
    let interval;
    if (!isResetting && !dissolutionCompleted) {
      interval = setInterval(() => {
        const baseRate = stirringSpeed * 0.1 + temperature * 0.01;
        // Sand doesn't dissolve, only sugar does
        const dissolutionRate = isSugar
          ? baseRate * 0.8 // Sugar dissolves slower
          : 0; // Sand doesn't dissolve at all

        setDissolved((prev) => {
          // Only increase dissolution for sugar, not for sand
          if (isSugar) {
            const newValue = Math.min(1, prev + dissolutionRate * 0.01);
            return newValue;
          }
          return prev; // Sand stays the same
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [
    dissolved,
    stirringSpeed,
    temperature,
    isSugar,
    isResetting,
    dissolutionCompleted,
  ]);

  const { dissolvingData, setDissolvingData } = useContext(ExperimentContext);

  const recordDataPoint = () => {
    const currentTime = (Date.now() - startTimeRef.current) / 1000; // Convert to seconds
    const newDataPoint = {
      time: currentTime.toFixed(1),
      concentration: (dissolved * 100).toFixed(2),
      temperature,
      stirringSpeed,
    };
    setData((prevData) => [...prevData, newDataPoint]);
    setDissolvingData([...dissolvingData, newDataPoint]);
  };

  const clearData = () => {
    setData([]);
    setDissolvingData([]);
    startTimeRef.current = Date.now();
  };

  const handleStirringSpeedChange = (newSpeed) => {
    resetSimulation();
    setStirringSpeed(newSpeed);
  };

  const handleTemperatureChange = (newTemp) => {
    resetSimulation();
    setTemperature(newTemp);
  };

  const handleSugarToggle = () => {
    setIsSugar(!isSugar);
    resetSimulation();
  };
  return (
    <div
      style={{ backgroundImage: "url(page-three-bg.png)" }}
      className="w-full bg-no-repeat bg-bottom bg-cover h-screen "
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          <SimulationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            data={data}
          />
          <div className="absolute md:bottom-8 md:right-1/2 md:translate-x-1/2 md:h-96 md:w-96 p-2">
            <Canvas camera={{ position: [0, 1, 4] }}>
              <ambientLight intensity={1} />
              <pointLight position={[10, 10, 10]} />
              <Beaker
                rotationAngle={rotationAngle}
                stirringSpeed={stirringSpeed}
              >
                <ThreeSoluteCubes
                  dissolved={dissolved}
                  isResetting={isResetting}
                  isSugar={isSugar}
                  rotationAngle={rotationAngle}
                />
                {/* Show particles system differently based on sugar or sand */}
                {isSugar ? (
                  <SugarParticleSystem
                    stirringSpeed={stirringSpeed}
                    temperature={temperature}
                    dissolved={dissolved}
                  />
                ) : (
                  <SandParticleSystem
                    stirringSpeed={stirringSpeed}
                    temperature={temperature}
                    isResetting={isResetting}
                  />
                )}
              </Beaker>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2.5}
                minAzimuthAngle={-Math.PI / 4}
                maxAzimuthAngle={Math.PI / 4}
              />
            </Canvas>
          </div>
          <div className="absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
            <SimulationControls
              stirringSpeed={stirringSpeed}
              temperature={temperature}
              isSugar={isSugar}
              onStirringSpeedChange={handleStirringSpeedChange}
              onTemperatureChange={handleTemperatureChange}
              onSugarToggle={handleSugarToggle}
              onRecordDataPoint={recordDataPoint}
              onClearData={clearData}
              sandMode={!isSugar} // Passing a prop to indicate it's in sand mode
            />
          </div>
          <img
            src="male-main.png"
            className="absolute hidden md:block h-[50vh] z-0 -bottom-5 right-[10vw] "
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default DissolvingSolidsSimulation;

// Separate sugar particle system for dissolved sugar
const SugarParticleSystem = ({ stirringSpeed, temperature, dissolved }) => {
  const particles = useRef([]);
  const group = useRef();

  useFrame(() => {
    if (group.current && dissolved > 0) {
      particles.current.forEach((particle, i) => {
        // Apply brownian motion based on temperature
        particle.position.x += (Math.random() - 0.5) * temperature * 0.001;
        particle.position.y += (Math.random() - 0.5) * temperature * 0.001;
        particle.position.z += (Math.random() - 0.5) * temperature * 0.001;

        // Apply stirring motion
        const angle = stirringSpeed * 0.01;
        const x = particle.position.x;
        const z = particle.position.z;
        particle.position.x = x * Math.cos(angle) - z * Math.sin(angle);
        particle.position.z = x * Math.sin(angle) + z * Math.cos(angle);
      });
    }
  });

  return (
    <group ref={group}>
      {dissolved > 0 && (
        <instancedMesh count={Math.floor(dissolved * 100)}>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial
            color="#f4e4bc" // Yellowish for sugar
            transparent
            opacity={0.6}
          />
        </instancedMesh>
      )}
    </group>
  );
};

// New sand particle system that simulates sand particles
const SandParticleSystem = ({ stirringSpeed, temperature, isResetting }) => {
  const particles = useRef([]);
  const count = 300; // More sand particles for realistic look
  const group = useRef();
  const sandMaterialRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create a state to store particles data that can be reset
  const [sandParticles, setSandParticles] = useState(() =>
    createInitialParticles()
  );

  // Function to generate initial particles
  function createInitialParticles() {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 1.4,
        -0.8 + Math.random() * 0.6, // Keep sand particles near bottom
        (Math.random() - 0.5) * 1.4,
      ],
      scale: 0.3 + Math.random() * 0.7, // Varied particle sizes
      rotation: Math.random() * Math.PI,
      velocity: [0, -0.0009 - Math.random() * 0.003, 0], // Slowly settling sand
    }));
  }

  // Reset particles when isResetting changes to true
  useEffect(() => {
    if (isResetting) {
      // Reset particles to initial state
      setSandParticles(createInitialParticles());
    }
  }, [isResetting]);

  useFrame((state) => {
    if (group.current) {
      // Update each sand particle
      sandParticles.forEach((particle, i) => {
        // Apply stirring effect for particles not at the bottom
        if (particle.position[1] > -0.9) {
          // Apply brownian motion based on temperature
          particle.position[0] += (Math.random() - 0.5) * temperature * 0.0002;
          particle.position[2] += (Math.random() - 0.5) * temperature * 0.0002;

          // Gravity effect - sand settles to the bottom
          particle.position[1] += particle.velocity[1];

          // Apply stirring motion if the particle is not at the bottom
          const angle = stirringSpeed * 0.005;
          const x = particle.position[0];
          const z = particle.position[2];

          // Calculate if the particle is being stirred strongly enough to move
          const distFromCenter = Math.sqrt(x * x + z * z);
          const stirringEffect =
            stirringSpeed * 0.01 * (1 - distFromCenter / 1.5);

          if (stirringEffect > 0.01 && particle.position[1] > -0.95) {
            // Apply rotation from stirring
            particle.position[0] = x * Math.cos(angle) - z * Math.sin(angle);
            particle.position[2] = x * Math.sin(angle) + z * Math.cos(angle);

            // Sometimes move particles up a bit when stirring fast
            if (stirringSpeed > 2 && Math.random() > 0.97) {
              particle.position[1] += stirringSpeed * 0.004;
            }
          }
        }

        // Constrain to beaker bounds
        const dist = Math.sqrt(
          particle.position[0] * particle.position[0] +
            particle.position[2] * particle.position[2]
        );
        if (dist > 0.9) {
          const ratio = 0.9 / dist;
          particle.position[0] *= ratio;
          particle.position[2] *= ratio;
        }

        // Keep particles from going below beaker bottom
        particle.position[1] = Math.max(particle.position[1], -0.95);

        // Apply to instanced mesh
        dummy.position.set(
          particle.position[0],
          particle.position[1],
          particle.position[2]
        );

        // Random scale for varied appearance
        const scale = 0.01 + 0.005 * particle.scale;
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.set(0, particle.rotation, 0);
        dummy.updateMatrix();

        group.current.setMatrixAt(i, dummy.matrix);
      });

      group.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={group} args={[null, null, count]}>
      {/* Use smaller irregular shapes for sand particles */}
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        ref={sandMaterialRef}
        color="#c2b280" // Sand color
        roughness={0.8}
        metalness={0.1}
      />
    </instancedMesh>
  );
};

const Beaker = ({ children, rotationAngle, stirringSpeed }) => {
  const liquidRef = useRef();
  const surfaceRef = useRef();
  const shaderRef = useRef();

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: liquidVertexShader,
        fragmentShader: liquidFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#4499ff") },
          uRotationSpeed: { value: 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Update shader uniforms in animation frame
  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
      shaderMaterial.uniforms.uRotationSpeed.value = stirringSpeed * 0.01;
    }
  });

  useEffect(() => {
    if (liquidRef.current) {
      liquidRef.current.rotation.y = rotationAngle;
    }
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y = rotationAngle;
    }
  }, [rotationAngle]);

  return (
    <group>
      {/* Static beaker parts */}
      
      <mesh>
        <cylinderGeometry args={[1, 0.9, 2, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.98}
          thickness={0.02}
          roughness={0.05}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Rotating liquid body */}
      <group ref={liquidRef}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.95, 0.85, 1.5, 32, 32]} />
          <meshPhysicalMaterial
            color="#1F83E1"
            transparent
            opacity={"0.6"}
            transmission={0.3}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      </group>
      <group position={[0, 0.51, 0]}>{children}</group>
    </group>
  );
};
