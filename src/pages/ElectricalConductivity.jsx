import React, { useState, useEffect } from "react";
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
    if (isTestActive) {
      if (materials[currentMaterial].conductive) {
        setBrightness(Math.min(100, voltage * 100));
      } else {
        setBrightness(0);
      }

      // Auto-reset test after 2 seconds
      const timer = setTimeout(() => {
        setIsTestActive(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setBrightness(0);
    }
  }, [isTestActive, currentMaterial, voltage]);

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
        backgroundImage: "url('conductivity/bg-image.png')",
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
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2  bottom-16">
      {/* Light Bulb with Glow Effect */}
      <div className="">
        {/* Bulb Glow Effect */}
        {brightness > 0 && (
          <div
            className="absolute inset-0 rounded-full blur-xl z-0"
            style={{
              backgroundColor: `rgba(255, 255, 0, ${brightness / 100})`,
              opacity: brightness / 100,
              transform: `scale(${1 + brightness / 100})`,
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
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Glow effect based on brightness */}
          {brightness > 0 && (
            <ellipse
              cx="200"
              cy="100"
              rx="70"
              ry="90"
              fill={`rgba(255, 255, 0, ${brightness / 150})`}
              filter="url(#glow)"
              opacity={brightness / 100}
            />
          )}
          {/* Light bulb */}
          <ellipse
            cx="200"
            cy="100"
            rx="60"
            ry="80"
            fill="#FFEB85"
            stroke="black"
            strokeWidth="1"
          />
          <path
            d="M160 150 L160 170 L240 170 L240 150"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
          {/* Filament */}
          <path
            d="M190 120 L190 90 L180 80 L220 80 L210 90 L210 120"
            fill="none"
            stroke={brightness > 0 ? "#FFB700" : "#aaa"}
            strokeWidth="1.5"
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
          <text
            x="200"
            y="455"
            fontFamily="Arial"
            fontSize="30"
            fill="#ffffff"
            textAnchor="middle"
          >
            Circuit Board
          </text>
        </svg>
      </div>
    </div>
  );
};

const ControlPanel = ({
  voltage,
  setVoltage,
  materials,
  selectMaterial,
  currentMaterial,
  isTestActive,
  setIsTestActive,
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

        {/* Test button */}
        <div className="flex gap-5 items-center justify-center w-full">
          <button
            onClick={() => setIsTestActive(true)}
            disabled={isTestActive}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
              isTestActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Test
          </button>
          <button
            onClick={recordData}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Record Data
          </button>
        </div>
      </div>
    </div>
  );
};
