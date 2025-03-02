import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Maximize2, Minimize2 } from "lucide-react";

const WaterDroplet = ({ temperature }) => {
  const mesh = useRef();
  const [isEvaporating, setIsEvaporating] = useState(false);

  // Generate position on a circle
  const generateCircularPosition = () => {
    const radius = 3.8; // Increased radius to match container
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius; // Square root for uniform distribution
    return {
      x: Math.cos(angle) * r,
      y: -0.8,
      z: Math.sin(angle) * r,
    };
  };

  const initialPosition = generateCircularPosition();

  const velocity = useRef({
    x: (Math.random() - 0.5) * 0.05,
    y: 0,
    z: (Math.random() - 0.5) * 0.05,
  });

  useEffect(() => {
    if (temperature > 60 && !isEvaporating) {
      setIsEvaporating(true);
    }
  }, [temperature]);

  useFrame((state, delta) => {
    const tempFactor = (temperature / 100) * 0.7;

    if (isEvaporating) {
      velocity.current.y = 0.08 * tempFactor;
      mesh.current.scale.multiplyScalar(0.997);
    }

    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    mesh.current.rotation.z = Math.cos(state.clock.elapsedTime * 2) * 0.1;

    mesh.current.position.x += velocity.current.x * delta;
    mesh.current.position.y += velocity.current.y * delta;
    mesh.current.position.z += velocity.current.z * delta;

    // Keep particles within circular boundary
    const distanceFromCenter = Math.sqrt(
      Math.pow(mesh.current.position.x, 2) +
        Math.pow(mesh.current.position.z, 2)
    );

    if (
      distanceFromCenter > 1.8 ||
      mesh.current.position.y > 2 ||
      mesh.current.scale.x < 0.1
    ) {
      const newPos = generateCircularPosition();
      mesh.current.position.set(newPos.x, newPos.y, newPos.z);
      mesh.current.scale.set(1, 1, 1);
      setIsEvaporating(false);
    }
  });

  return (
    <mesh
      ref={mesh}
      position={[initialPosition.x, initialPosition.y, initialPosition.z]}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshPhysicalMaterial
        color="#a8d5ff"
        transparent
        opacity={isEvaporating ? 0.6 : 0.9}
        clearcoat={0.8}
        clearcoatRoughness={0.1}
        metalness={0.1}
        roughness={0.2}
        reflectivity={0.8}
        ior={1.4}
        transmission={0.9}
      />
    </mesh>
  );
};

const FogParticle = ({ temperature }) => {
  const mesh = useRef();

  const generateCircularPosition = () => {
    const radius = 1.8;
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;
    return {
      x: Math.cos(angle) * r,
      y: -0.8,
      z: Math.sin(angle) * r,
    };
  };

  const initialPosition = generateCircularPosition();

  useFrame((state, delta) => {
    if (temperature > 60) {
      const tempFactor = (temperature - 60) / 40;

      mesh.current.position.y += delta * 0.4 * tempFactor;
      mesh.current.position.x +=
        Math.sin(state.clock.elapsedTime + mesh.current.position.z) *
        delta *
        0.1;
      mesh.current.position.z +=
        Math.cos(state.clock.elapsedTime + mesh.current.position.x) *
        delta *
        0.1;

      mesh.current.material.opacity =
        Math.max(0, 0.2 - mesh.current.position.y / 3) * tempFactor;

      const distanceFromCenter = Math.sqrt(
        Math.pow(mesh.current.position.x, 2) +
          Math.pow(mesh.current.position.z, 2)
      );

      if (distanceFromCenter > 1.8 || mesh.current.position.y > 2) {
        const newPos = generateCircularPosition();
        mesh.current.position.set(newPos.x, newPos.y, newPos.z);
      }
    }
  });

  return (
    <mesh
      ref={mesh}
      position={[initialPosition.x, initialPosition.y, initialPosition.z]}
    >
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color="#e6f3ff" transparent opacity={0.15} />
    </mesh>
  );
};

const EvaporationSimulation = () => {
  const [temperature, setTemperature] = useState(20);
  const [evaporationData, setEvaporationData] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);

  const recordData = () => {
    const newData = {
      timestamp: new Date().toLocaleTimeString(),
      temperature: temperature,
      evaporationRate: (temperature * 0.5).toFixed(2),
    };
    setEvaporationData((prev) => [...prev, newData]);
  };

  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;
    if ((tab === "table" || tab === "graph") && recordData.length === 0) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          No recorded data to show. Record some data by clicking the "Record
          Data" button!
        </div>
      );
    }
    switch (tab) {
      case "description":
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">
              Evaporation: The Hidden World of Particles
            </h2>
            <p className="mb-2">
              Watch how water molecules behave as temperature changes!
            </p>
            <p>
              <strong>Temperature:</strong> {temperature}°C
            </p>
            <p className="mt-2 text-gray-600">
              As temperature increases, water molecules gain energy and
              evaporate faster.
            </p>
          </div>
        );
      case "table":
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg overflow-auto max-h-80">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Temperature (°C)</th>
                  <th className="px-4 py-2">Evaporation Rate</th>
                </tr>
              </thead>
              <tbody>
                {evaporationData.map((data, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{data.timestamp}</td>
                    <td className="border px-4 py-2">{data.temperature}</td>
                    <td className="border px-4 py-2">{data.evaporationRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "graph":
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evaporationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff7300"
                  name="Temperature"
                />
                <Line
                  type="monotone"
                  dataKey="evaporationRate"
                  stroke="#387908"
                  name="Evaporation Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div
      style={{
        backgroundImage: "url(page-two-bg.png)",
      }}
      className="w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto">
        <div className="relative space-y-6 h-full mt-6">
          {/* tabs */}
          <div className="md:absolute hidden md:block md:top-14 md:w-96 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
            {["description", "table", "graph"].map((tab) => (
              <div key={tab} className="border-b">
                <button
                  className="w-full text-left px-4 py-2 bg-blue-200 hover:bg-blue-300"
                  onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                >
                  {tab.toUpperCase()}
                </button>
                {renderTabContent(tab)}
              </div>
            ))}
          </div>
          <div
            style={{
              backgroundImage: "url(glass-container.png)",
            }}
            className={`absolute bg-clip-padding overflow-hidden justify-center 
              items-center bg-cover bg-center bg-no-repeat md:right-1/2 
              md:translate-x-1/2 rounded-lg p-2 transition-all duration-300 ${
              isZoomed ? "h-64 w-64 top-1/2" : "h-52 w-52 top-1/2"
            }`}
          >
            <Canvas
              camera={{
                position: [4, 3, 6],
                fov: 60,
              }}
            >
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <directionalLight position={[0, 5, 5]} intensity={0.5} />

              {Array.from({ length: 80 }).map((_, i) => (
                <WaterDroplet key={i} temperature={temperature} />
              ))}

              {temperature > 60 &&
                Array.from({ length: 50 }).map((_, i) => (
                  <FogParticle key={i} temperature={temperature} />
                ))}

              
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4} // Allow limited vertical rotation
                maxPolarAngle={Math.PI / 2} // Restrict looking too far down or up
                minAzimuthAngle={-Math.PI / 4} // Allow limited horizontal rotation
                maxAzimuthAngle={Math.PI / 4} // Restrict rotation range
              />
            </Canvas>
          </div>

          <div className="absolute bottom-10 left-4 right-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg">
            <div className="flex space-x-4 justify-center items-center gap-10">
              <div>
                <label className="text-white text-sm">
                  Temperature ({temperature}°C)
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={recordData}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Record Data
              </button>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                {isZoomed ? (
                  <>
                    <Minimize2 className="w-5 h-5" />
                    {"Zoom Out"}
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-5 h-5" />
                    {"Zoom In"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaporationSimulation;
