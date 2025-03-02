import React, { useState, useEffect, useRef, useContext } from "react";
import * as THREE from "three";
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
  BarChart,
  Bar,
} from "recharts";
import { ExperimentContext } from "../context/Context";
const GasMolecule = ({
  position,
  speed,
  containerSize,
  temperature,
  pressure,
  sodaEffect,
}) => {
  const mesh = useRef();
  const initialY = position[1];
  const velocity = useRef({
    x: (Math.random() - 0.5) * speed * pressure,
    y: (Math.random() - 0.5) * speed * pressure,
    z: (Math.random() - 0.5) * speed * pressure,
  });

  const randomizePosition = () => {
    mesh.current.position.set(
      (Math.random() - 0.5) * containerSize,
      -containerSize / 2, // Start from bottom
      (Math.random() - 0.5) * containerSize
    );
  };

  useFrame((state, delta) => {
    const tempFactor = (temperature / 100) * 0.7;
    const pressureFactor = pressure * 2;
    const baseSpeed = speed * tempFactor * pressureFactor;
    const extraHeight = 20;
    const bounds = containerSize * 0.5 - 0.2;

    if (sodaEffect) {
      // Soda effect behavior - can escape container
      velocity.current.y += 0.05 * pressureFactor;

      if (mesh.current.position.y > containerSize * 0.5 + extraHeight) {
        randomizePosition();
        velocity.current.y = Math.abs(velocity.current.y) * 0.3;
      }
    }

    // Update positions
    mesh.current.position.x += velocity.current.x * delta * baseSpeed;
    mesh.current.position.y += velocity.current.y * delta * baseSpeed;
    mesh.current.position.z += velocity.current.z * delta * baseSpeed;

    // Add random motion
    const randomFactor = (Math.random() - 0.5) * tempFactor * 0.1;
    velocity.current.x += randomFactor;
    velocity.current.y += randomFactor;
    velocity.current.z += randomFactor;

    // Boundary checking based on mode
    if (sodaEffect) {
      // Only check x and z boundaries, and bottom y boundary in soda mode
      ["x", "z"].forEach((axis) => {
        if (Math.abs(mesh.current.position[axis]) > bounds) {
          mesh.current.position[axis] =
            Math.sign(mesh.current.position[axis]) * bounds;
          velocity.current[axis] *= -1 * pressureFactor;
        }
      });

      // Check only bottom boundary for Y in soda mode
      if (mesh.current.position.y < -bounds) {
        mesh.current.position.y = -bounds;
        velocity.current.y *= -1 * pressureFactor;
      }
    } else {
      // Normal mode - check all boundaries
      ["x", "y", "z"].forEach((axis) => {
        if (Math.abs(mesh.current.position[axis]) > bounds) {
          mesh.current.position[axis] =
            Math.sign(mesh.current.position[axis]) * bounds;
          velocity.current[axis] *= -1 * pressureFactor;
        }
      });
    }

    // Normalize velocity
    const currentSpeed = Math.sqrt(
      velocity.current.x ** 2 +
        velocity.current.y ** 2 +
        velocity.current.z ** 2
    );

    if (currentSpeed > 0) {
      const targetSpeed = baseSpeed * (sodaEffect ? 1.2 : 1.0);
      velocity.current.x = (velocity.current.x / currentSpeed) * targetSpeed;
      velocity.current.y = (velocity.current.y / currentSpeed) * targetSpeed;
      velocity.current.z = (velocity.current.z / currentSpeed) * targetSpeed;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={sodaEffect ? "#88ccff" : "red"} />
    </mesh>
  );
};

// Container component remains the same
const Container = ({ volume }) => {
  const scale = 0.5 + volume * 0.5;
  return (
    <mesh>
      <boxGeometry args={[5 * scale, 5 * scale, 5 * scale]} />
      <meshStandardMaterial color="lightblue" transparent opacity={0.2} />
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(5 * scale, 5 * scale, 5 * scale)]}
        />
        <lineBasicMaterial color="black" />
      </lineSegments>
    </mesh>
  );
};

// Main component remains mostly the same, but pass new props to GasMolecule
const GasSimulation = () => {
  const [volume, setVolume] = useState(1.0);
  const [pressure, setPressure] = useState(1.0);
  const [temperature, setTemperature] = useState(100);
  const [sodaEffect, setSodaEffect] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [recordedData, setRecordedData] = useState([]);
  const { gasesData, setGasesData } = useContext(ExperimentContext);
  const recordCurrentState = () => {
    const newData = {
      id: Date.now(),
      volume: parseFloat(volume.toFixed(2)),
      pressure: parseFloat(pressure.toFixed(2)),
      temperature,
      timestamp: new Date().toLocaleTimeString(),
    };
    setRecordedData((prev) => [...prev, newData]);
    setGasesData((prev) => [...prev, newData]);
  };

  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    if (
      (tab === "table" ||
        tab === "barchart" ||
        tab === "graph" ||
        tab === "pvgraph") &&
      recordedData.length === 0
    ) {
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
          <div className="bg-white pl-2 pt-2 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Labby’s Lab Check-In</h2>
            <p className="mb-1">
              Observe how a gas behaves when you change Volume, Pressure, and
              Temperature!
            </p>
            <div className="space-y-1">
              <p>
                <strong>Volume:</strong> {volume.toFixed(2)} ×
              </p>
              <p>
                <strong>Pressure:</strong> {pressure.toFixed(2)} ×
              </p>
              <p>
                <strong>Temperature:</strong> {temperature} °C
              </p>
            </div>
            <p className="mt-1 text-gray-600">
              (As volume decreases, molecules become more crowded, increasing
              pressure. Higher pressure alone does not speed them up, but
              increasing temperature does, as it raises their energy and
              accelerates their movement.)
            </p>
          </div>
        );
      case "table":
        return (
          <div className="bg-white p-1 rounded-lg shadow-lg overflow-hidden max-h-80">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1">Time</th>
                  <th className="px-2 py-1">Volume</th>
                  <th className="px-2 py-1">Pressure</th>
                  <th className="px-2 py-1">Temperature</th>
                </tr>
              </thead>
              <tbody>
                {recordedData.map((data) => (
                  <tr key={data.id} className="border-t">
                    <td className="px-2 py-1">{data.timestamp}</td>
                    <td className="px-2 py-1">{data.volume}</td>
                    <td className="px-2 py-1">{data.pressure}</td>
                    <td className="px-2 py-1">{data.temperature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "barchart":
        return (
          <div className="bg-white p-1 rounded-lg shadow-lg h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recordedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#8884d8" name="Volume" />
                <Bar dataKey="pressure" fill="#82ca9d" name="Pressure" />
                <Bar dataKey="temperature" fill="#ffc658" name="Temperature" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "pvgraph":
        return (
          <div className="bg-white p-6 mt-2 rounded-2xl shadow-xl w-full h-52">
            <h3 className="text-lg font-medium mb-4 text-center text-gray-900">
              Pressure vs. Volume
            </h3>
            <ResponsiveContainer width="80%" height="80%">
              <LineChart
                data={recordedData}
                margin={{ top: 10, right: 10, left: 10, bottom: 15 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0072ff" stopOpacity={1} />
                    <stop offset="100%" stopColor="#00c6ff" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="volume"
                  tick={{ fill: "black" }}
                  label={{
                    value: "Volume",
                    position: "insideBottom",
                    offset: -10,
                    fill: "black",
                    fontSize: 14,
                  }}
                  tickMargin={8}
                />
                <YAxis
                  dataKey="pressure"
                  tick={{ fill: "black" }}
                  label={{
                    value: "Pressure",
                    angle: -90,
                    position: "insideLeft",
                    fill: "black",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "10px",
                    color: "black",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#0072ff",
                    stroke: "#00c6ff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case "graph":
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recordedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#8884d8"
                  name="Volume"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#82ca9d"
                  name="Pressure"
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ffc658"
                  name="Temperature"
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
        backgroundImage: "url('bg-image.png')",
      }}
      className="w-full bg-no-repeat bg-center bg-cover h-screen"
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          {/*      */}
          <div className="md:absolute hidden md:block md:top-12 md:w-96 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
            {["description", "table", "barchart", "graph", "pvgraph"].map(
              (tab) => (
                <div key={tab} className="border-b">
                  <button
                    className="w-full text-left px-4 py-2 bg-blue-200 hover:bg-blue-300"
                    onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                  >
                    {tab.toUpperCase()}
                  </button>
                  {renderTabContent(tab)}
                </div>
              )
            )}
          </div>
          <div className="absolute md:bottom-32 md:right-1/2 md:translate-x-1/2 md:h-96 md:w-96 rounded-lg  border  p-2 ">
            <Canvas
              camera={{
                position: [8, 8, 8],
                fov: 60,
              }}
            >
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1} />

              <Container volume={volume} />

              {Array.from({ length: 50 }).map((_, i) => (
                <GasMolecule
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                  ]}
                  speed={1.5}
                  containerSize={5 * (0.5 + volume * 0.5)}
                  temperature={temperature}
                  pressure={pressure}
                  sodaEffect={sodaEffect}
                />
              ))}
              <OrbitControls />
            </Canvas>
          </div>
          {/* controls buttom     */}
          <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
            <div className="bg-gray-900 w-full z-50 text-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-around md:gap-10 gap-5">
              <div className="flex md:flex-col gap-3 items-center">
                <label className="text-blue-400 text-sm font-semibold">
                  Volume
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className=" h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <span className="text-sm">{volume.toFixed(2)} ×</span>
              </div>

              <div className="flex md:flex-col gap-3 items-center">
                <label className="text-blue-400 text-sm font-semibold">
                  Pressure
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.01"
                  value={pressure}
                  onChange={(e) => setPressure(parseFloat(e.target.value))}
                  className=" h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <span className="text-sm">{pressure.toFixed(2)} ×</span>
              </div>

              <div className="flex md:flex-col gap-3 items-center">
                <label className="text-blue-400 text-sm font-semibold">
                  Temperature (°C)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className=" h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <span className="text-sm">{temperature} °C</span>
              </div>

              <div className="flex md:flex-col gap-3 items-center">
                <button
                  onClick={recordCurrentState}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Record Data
                </button>
              </div>

              <div className="flex md:flex-col gap-3 justify-center items-center">
                <label className="text-blue-400 text-sm font-semibold">
                  Soda Effect
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sodaEffect}
                    onChange={() => setSodaEffect(!sodaEffect)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-500 rounded-full peer-checked:bg-green-500 relative">
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                        sodaEffect ? "left-6" : "left-1"
                      }`}
                    />
                  </div>
                </label>
                <span className="text-sm">{sodaEffect ? "On" : "Off"}</span>
              </div>
            </div>
          </div>
          <img
            src="male-main.png"
            className="absolute hidden md:block h-[55vh] z-0 -bottom-2 right right-[10%] animate-[float_3s_ease-in-out_infinite]"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default GasSimulation;
