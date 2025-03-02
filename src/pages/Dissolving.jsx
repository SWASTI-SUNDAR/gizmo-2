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
        const dissolutionRate = isSugar
          ? baseRate * 0.8 // Sugar dissolves slower
          : baseRate * 1.0; // Salt dissolves faster

        setDissolved((prev) => {
          const newValue = Math.min(1, prev + dissolutionRate * 0.01);
          return newValue;
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
              <Beaker rotationAngle={rotationAngle}>
                <ThreeSoluteCubes
                  dissolved={dissolved}
                  isResetting={isResetting}
                  isSugar={isSugar}
                  rotationAngle={rotationAngle}
                />
                <ParticleSystem
                  stirringSpeed={stirringSpeed}
                  temperature={temperature}
                  dissolved={dissolved}
                  isSugar={isSugar}
                />
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

const ParticleSystem = ({ stirringSpeed, temperature, dissolved, isSugar }) => {
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
          {/* Different particle sizes for sugar and salt */}
          <sphereGeometry args={[isSugar ? 0.02 : 0.015]} />
          <meshStandardMaterial
            color={isSugar ? "#f4e4bc" : "#f5f5f5"} // Yellowish for sugar, white for salt
            transparent
            opacity={0.6}
          />
        </instancedMesh>
      )}
    </group>
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
        <cylinderGeometry args={[1.05, 0.95, 2.1, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
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
            opacity={1}
            transmission={0.3}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Liquid surface with shader effect */}
      <group ref={surfaceRef} position={[0, 0.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.9, 1.9, 32, 32]} />
          <primitive object={shaderMaterial} />
        </mesh>
      </group>

      <group position={[0, 0.51, 0]}>{children}</group>
    </group>
  );
};
