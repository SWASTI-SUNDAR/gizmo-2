import React, { useState, useEffect, useContext } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const ConductivitySimulation = () => {
  // State variables
  const [voltage, setVoltage] = useState(0.5);
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState("copper");
  const [activeTab, setActiveTab] = useState("description");
  const [volume, setVolume] = useState(0.98);
  const [pressure, setPressure] = useState(100);
  const [temperature, setTemperature] = useState(25);
  const [brightness, setBrightness] = useState(0);
  // Add state for recorded data
  const [recordedData, setRecordedData] = useState([]);

  // Materials data
  const materials = {
    copper: { name: "Copper", conductive: true, resistivity: 0.05 },
    wood: { name: "Wood", conductive: false, resistivity: 0 },
    plastic: { name: "Plastic", conductive: false, resistivity: 0 },
  };

  // Effect for test activation
  useEffect(() => {
    if (materials[currentMaterial].conductive) {
      setBrightness(Math.min(100, voltage * 100));
    } else {
      setBrightness(0);
    }
  }, [currentMaterial, voltage]);

  // Handle material selection
  const selectMaterial = (material) => {
    setCurrentMaterial(material);
  };
  
  // Add function to record data
  const recordData = () => {
    const newData = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      material: materials[currentMaterial].name,
      voltage: voltage,
      brightness: brightness,
      conductive: materials[currentMaterial].conductive ? "Yes" : "No",
    };
    setRecordedData([...recordedData, newData]);
  };

  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    if ((tab === "table" || tab === "graph") && recordedData.length === 0) {
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
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Conductivity Test</h2>
            <p className="text-sm mb-4">
              Test different materials to see which ones conduct electricity and
              light up the bulb.
            </p>

            <div className="text-sm mb-2">
              <span className="font-bold">Current Material: </span>
              {materials[currentMaterial].name}
            </div>

            <div className="text-sm mb-2">
              <span className="font-bold">Voltage: </span>
              {voltage.toFixed(2)} V
            </div>

            <div className="text-sm mb-2">
              <span className="font-bold">Conductive: </span>
              {materials[currentMaterial].conductive ? "Yes" : "No"}
            </div>

            
          </div>
        );
      case "table":
        return (
          <div className="bg-white p-1 rounded-lg overflow-x-scroll overflow-y-scroll shadow-lg overflow-hidden max-h-80">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1">Time</th>
                  <th className="px-2 py-1">Material</th>
                  <th className="px-2 py-1">Voltage (V)</th>
                  <th className="px-2 py-1">Conductive</th>
                  <th className="px-2 py-1">Brightness</th>
                </tr>
              </thead>
              <tbody>
                {recordedData.map((data) => (
                  <tr key={data.id} className="border-t">
                    <td className="px-2 py-1">{data.timestamp}</td>
                    <td className="px-2 py-1">{data.material}</td>
                    <td className="px-2 py-1">{data.voltage.toFixed(2)}</td>
                    <td className="px-2 py-1">{data.conductive}</td>
                    <td className="px-2 py-1">{data.brightness.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "graph":
        // Filter to show only conductive materials
        const conductiveData = recordedData.filter(
          (data) => data.conductive === "Yes"
        );

        return (
          <div className="bg-white p-4 rounded-lg shadow-lg h-52">
            <h3 className="text-lg font-medium mb-2 text-center">
              Voltage vs. Bulb Brightness
            </h3>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={conductiveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="voltage"
                  label={{
                    value: "Voltage (V)",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Brightness (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "brightness" ? "Brightness (%)" : name,
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="brightness"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Brightness"
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
        backgroundImage: "url('bg-image-first.png')",
      }}
      className="w-full bg-no-repeat bg-center bg-cover h-screen"
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          {/* Circuit experiment */}
          <div className="md:absolute hidden md:block md:top-12 md:w-96 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
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

          {/* simulation */}
          <BulbCircuit brightness={brightness} />

          <ControlPanel
            voltage={voltage}
            setVoltage={setVoltage}
            materials={materials}
            selectMaterial={selectMaterial}
            currentMaterial={currentMaterial}
            isTestActive={isTestActive}
            setIsTestActive={setIsTestActive}
            recordData={recordData}
          />

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

export default ConductivitySimulation;

const BulbCircuit = ({ brightness }) => {
  // Whether the bulb is on (any brightness greater than 0)
  const isOn = brightness > 0;

  // Normalized brightness to use in calculations (0.0-1.0)
  const normalizedBrightness = brightness / 100;

  // Dynamic color based on brightness - from warm yellow to bright white
  const bulbColor = isOn
    ? `rgb(255, ${Math.min(255, 200 + brightness * 0.55)}, ${Math.min(
        255,
        160 + brightness * 0.95
      )})`
    : "#FFEB85";

  // Animation speed for electron flow
  const animationSpeed = isOn
    ? Math.max(0.5, 2 - normalizedBrightness * 1.5)
    : 0;

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-16">
      {/* Light rays (visible when bulb is on) */}
      {isOn && (
        <div
          className="absolute w-64 h-64 rounded-full bg-yellow-200 bg-opacity-50 blur-2xl z-0"
          style={{
            boxShadow: `0 0 40px 20px ${bulbColor}`,
            animation: "flicker 0.1s ease-in-out infinite",
          }}
        ></div>
      )}
      {/* Light Bulb with Glow Effect */}
      <div className="relative">
        {/* Bulb outer glow */}
        {isOn && (
          <div
            className="absolute rounded-full blur-2xl z-0"
            style={{
              width: "150px",
              height: "180px",
              top: "-20px",
              left: "50%",
              transform: `translateX(-50%) scale(${
                1 + normalizedBrightness * 0.5
              })`,
              backgroundColor: bulbColor,
              opacity: normalizedBrightness * 0.8,
              boxShadow: `0 0 40px 20px ${bulbColor}`,
            }}
          ></div>
        )}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 500"
          className="w-64 h-96 relative z-10"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={isOn ? 8 : 3} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glass texture */}
            <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>

            {/* Animation path for electrons */}
            <path
              id="wirePath1"
              d="M175 195 C130 220, 150 270, 120 300 C100 330, 120 380, 100 400 L100 420"
            />
            <path
              id="wirePath2"
              d="M225 195 C270 220, 250 270, 280 300 C300 330, 280 380, 300 400 L300 420"
            />
          </defs>

          {/* Light Bulb internal glow */}
          {isOn && (
            <ellipse
              cx="200"
              cy="100"
              rx="70"
              ry="90"
              fill={bulbColor}
              filter="url(#glow)"
              opacity={normalizedBrightness}
            />
          )}

          {/* Light bulb glass */}
          <ellipse
            cx="200"
            cy="100"
            rx="60"
            ry="80"
            fill={isOn ? bulbColor : "#FFEB85"}
            stroke="#ddd"
            strokeWidth="2"
            style={{
              filter: isOn ? "url(#glow)" : "none",
            }}
          />
          {/* Glass reflections */}
          <ellipse
            cx="180"
            cy="80"
            rx="20"
            ry="30"
            fill="url(#glass)"
            opacity="0.6"
          />

          {/* Connection to base */}
          <path
            d="M160 150 L160 170 L240 170 L240 150"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />

          {/* Animated filament */}
          <path
            d="M190 120 L190 90 L180 80 L220 80 L210 90 L210 120"
            fill="none"
            stroke={isOn ? "#FFD700" : "#aaa"}
            strokeWidth={isOn ? 2 : 1.5}
            style={{
              filter: isOn ? "drop-shadow(0 0 3px #FF6700)" : "none",
              animation: isOn
                ? "filamentGlow 1s ease-in-out infinite alternate"
                : "none",
            }}
          />

          {/* Base */}
          <rect
            x="170"
            y="170"
            width="60"
            height="20"
            fill="#c0c0c0"
            stroke="black"
            strokeWidth="1"
          />
          <rect
            x="175"
            y="190"
            width="50"
            height="10"
            fill="#a0a0a0"
            stroke="black"
            strokeWidth="1"
          />

          {/* Wires */}
          <path
            d="M175 195 C130 220, 150 270, 120 300 C100 330, 120 380, 100 400 L100 420"
            fill="none"
            stroke="#EF4444"
            strokeWidth="4"
          />
          <path
            d="M225 195 C270 220, 250 270, 280 300 C300 330, 280 380, 300 400 L300 420"
            fill="none"
            stroke="#22C55E"
            strokeWidth="4"
          />

          {/* Electrons moving through wires when conducting */}
          {isOn &&
            [...Array(8)].map((_, i) => (
              <React.Fragment key={i}>
                <circle r="3" fill="#ffff00">
                  <animateMotion
                    dur={`${animationSpeed + i * 0.2}s`}
                    repeatCount="indefinite"
                    path="M175 195 C130 220, 150 270, 120 300 C100 330, 120 380, 100 400 L100 420"
                    rotate="auto"
                  />
                </circle>
                <circle r="3" fill="#ffff00">
                  <animateMotion
                    dur={`${animationSpeed + i * 0.2}s`}
                    repeatCount="indefinite"
                    path="M225 195 C270 220, 250 270, 280 300 C300 330, 280 380, 300 400 L300 420"
                    rotate="auto"
                  />
                </circle>
              </React.Fragment>
            ))}

          {/* Circuit Board */}
          <rect
            x="80"
            y="420"
            width="240"
            height="160"
            fill="#7f1d1d"
            stroke="black"
            strokeWidth="1"
          />

          {/* Circuit components */}
          <text
            x="200"
            y="455"
            fontFamily="Arial"
            fontSize="20"
            fill="#ffffff"
            textAnchor="middle"
          >
            Circuit Board
          </text>
        </svg>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes flicker {
          0%,
          100% {
            opacity: ${normalizedBrightness * 0.6};
            transform: translateX(-50%) rotate(${Math.random() * 360}deg)
              scaleY(1);
          }
          50% {
            opacity: ${normalizedBrightness * 0.3};
            transform: translateX(-50%) rotate(${Math.random() * 360}deg)
              scaleY(0.8);
          }
        }

        @keyframes filamentGlow {
          0% {
            stroke: #ffb700;
            filter: drop-shadow(0 0 3px #ff6700);
          }
          100% {
            stroke: #ffdd00;
            filter: drop-shadow(0 0 5px #ffaa00);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: ${normalizedBrightness * 0.8};
            transform: scale(1);
          }
          50% {
            opacity: ${normalizedBrightness * 0.6};
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

const ControlPanel = ({
  voltage,
  setVoltage,
  materials,
  selectMaterial,
  currentMaterial,
  recordData,
}) => {
  return (
    <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 w-full z-50 text-white p-3 rounded-lg shadow-lg grid grid-cols-3 justify-center items-center md:gap-10 gap-5">
        {/* Voltage slider */}
        <div className="flex flex-col w-full gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">Voltage</span>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          <span className="text-sm ml-2 w-12">{voltage.toFixed(2)}</span>
        </div>

        {/* Material selector */}
        <div className="flex gap-6 items-center justify-center w-full">
          {Object.keys(materials).map((material) => (
            <div
              key={material}
              className="flex flex-col gap-2 items-center justify-center"
            >
              <span className="text-blue-400 text-sm font-semibold capitalize">
                {material}
              </span>
              <button
                onClick={() => selectMaterial(material)}
                className={`w-6 h-6 rounded-full border-2 ${
                  currentMaterial === material
                    ? "border-white"
                    : "border-gray-400"
                }`}
                style={{
                  backgroundColor:
                    material === "copper"
                      ? "#b87333"
                      : material === "wood"
                      ? "#8B4513"
                      : "#E6E6FA",
                }}
              >
                {currentMaterial === material && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto"></div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Record Data button (keeping only this one) */}
        <div className="flex justify-center items-center w-full">
          <button
            onClick={recordData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Record Data
          </button>
        </div>
      </div>
    </div>
  );
};
