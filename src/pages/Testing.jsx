import { Slider } from "@radix-ui/react-slider";
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const MagneticPropertiesLab = () => {
  const [magnetStrength, setMagnetStrength] = useState(50);
  const [selectedMaterial, setSelectedMaterial] = useState("iron");
  const [testResult, setTestResult] = useState(null);
  const [distanceData, setDistanceData] = useState([]);
  const [binAnimation, setBinAnimation] = useState(false);

  const [activeTab, setActiveTab] = useState("description");
  const [testedMaterials, setTestedMaterials] = useState([]);

  // Inside your MagneticPropertiesLab component
  const [materialLocation, setMaterialLocation] = useState("workspace"); // "workspace", "magneticBin", or "nonMagneticBin"
  const [dragEnabled, setDragEnabled] = useState(true);

  // Reset function to add to your component
  const resetExperiment = () => {
    setTestResult(null);
    setMaterialLocation("workspace");
    setBinAnimation(false);
    setDragEnabled(true);
    // Reset any other state you need
  };

  const materials = [
    { id: "iron", name: "Iron", isMagnetic: true, attractionStrength: 0.9 },
    {
      id: "aluminum",
      name: "Aluminum",
      isMagnetic: false,
      attractionStrength: 0,
    },
    { id: "glass", name: "Glass", isMagnetic: false, attractionStrength: 0 },
  ];

  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    if ((tab === "table" || tab === "graph") && testedMaterials.length === 0) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          No recorded data to show. Test materials to see results.
        </div>
      );
    }

    switch (tab) {
      case "description":
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Magnetism Test</h2>
            <p className="text-sm mb-4">
              Test different materials to see if they are attracted to the
              magnet.
            </p>
          </div>
        );

      case "table":
        return (
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Data Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300">Material</th>
                    <th className="p-2 border border-gray-300">Magnetic</th>
                  </tr>
                </thead>
                <tbody>
                  {testedMaterials.length > 0 ? (
                    testedMaterials.map((material) => (
                      <tr key={material.id}>
                        <td className="p-2 border border-gray-300">
                          {material.name}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          <span
                            className={
                              material.isMagnetic
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {material.isMagnetic ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="p-2 border border-gray-300 text-center text-gray-500"
                      >
                        Test materials to see results
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "graph":
        return (
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Attraction Graph</h3>
            {distanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={distanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="strength"
                    label={{
                      value: "Magnet Strength (%)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Distance (cm)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 border border-gray-300 flex items-center justify-center text-gray-500">
                Test magnetic materials to generate graph
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleTest = () => {
    const material = materials.find((m) => m.id === selectedMaterial);
    const result = material.isMagnetic;
    setTestResult(result);

    // Add to tested materials if not already tested
    if (!testedMaterials.some((m) => m.id === material.id)) {
      setTestedMaterials([...testedMaterials, { ...material, tested: true }]);
    }

    // Generate distance data points for magnetic materials
    if (result) {
      const newDataPoints = [];
      for (let strength = 10; strength <= 100; strength += 10) {
        // Calculate simulated distance based on strength and material
        const distance = (100 - strength) * (1 - material.attractionStrength);
        newDataPoints.push({
          strength,
          distance,
          material: material.name,
        });
      }
      setDistanceData(newDataPoints);
    }

    // Trigger bin animation
    setBinAnimation(true);
    setTimeout(() => setBinAnimation(false), 1500);
  };

  return (
    <div
      className="w-full bg-no-repeat bg-center bg-cover h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('page-two-bg.png')",
      }}
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
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
          ;{/* Left panel - Controls */}
          <ControlPanel
            magnetStrength={magnetStrength}
            setMagnetStrength={setMagnetStrength}
            materials={materials}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            handleTest={handleTest}
            testResult={testResult}
          />
          {/* Main container - White box that holds the magnetism simulation */}
          <div className="-rotate-90 w-[50%] left-[25%] absolute rounded-lg p-4 top-10  overflow-hidden">
            {/* Main simulation area - Container for all the interactive elements */}
            <div className="flex items-center justify-center h-64 relative">
              {/* Material object - The item being tested for magnetism */}
              <div
                className="absolute"
                style={{
                  // Position calculation - Moves the material closer to the magnet
                  // if it's iron and magnetic, otherwise stays in place
                  left:
                    selectedMaterial === "iron" && testResult
                      ? `${Math.max(40, 60 - magnetStrength * 0.2)}%`
                      : "60%",
                  transition: "left 0.5s ease-out", // Smooth animation when moving
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Material visual representation */}
                  <div className="w-16 h-16 rounded flex items-center justify-center">
                    <img
                      src={`${selectedMaterial}.png`}
                      className="text-xs"
                    ></img>
                  </div>
                </div>
              </div>
              {/* Magnet object - The source of magnetic attraction */}
              <div className="absolute left-10">
                {/* Magnet visual representation (red and blue ends) */}
                <div className="h-32 w-32 rounded flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rotate-90 flex">
                    <img src="magnet.png" className=""></img>
                  </div>
                </div>
                {/* Magnetic field visualization - Concentric circles showing field strength */}
                <div className="absolute top-0 left-full">
                  {magnetStrength > 20 && (
                    <div className="w-20 h-12 flex items-center justify-center">
                      {/* Generate circles based on magnet strength */}
                      {[...Array(Math.floor(magnetStrength / 20))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="absolute w-20 h-20 rounded-full border border-blue-400 opacity-20"
                            style={{
                              width: `${(i + 1) * 20}px`, // Increasing size for each circle
                              height: `${(i + 1) * 20}px`,
                            }}
                          ></div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Result bins - Visual indicators for sorting materials */}
          </div>
          {/* Errors panel */}
          <div className=" absolute bottom-24 rounded-lg p-4 shadow-lg">
            {testResult !== null && (
              <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200">
                <p className="font-medium text-black">
                  Test Result: {selectedMaterial} is
                  <span
                    className={`font-bold ${
                      testResult ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {testResult ? " magnetic" : " not magnetic"}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes magneticWave {
          0% {
            transform: scale(0.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes particleMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${magnetStrength / 2}px);
          }
        }
      `}</style>
    </div>
  );
};

export default MagneticPropertiesLab;

const ControlPanel = ({
  magnetStrength,
  setMagnetStrength,
  materials,
  selectedMaterial,
  setSelectedMaterial,
  handleTest,
  testResult,
}) => {
  return (
    <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 w-full z-50 text-white p-3 rounded-lg shadow-lg grid grid-cols-3 justify-center items-center md:gap-10 gap-5">
        {/* Material selector */}
        <div className="flex gap-6 items-center justify-center w-full">
          {materials.map((material) => (
            <div
              key={material.id}
              className="flex flex-col gap-2 items-center justify-center"
            >
              <span className="text-blue-400 text-sm font-semibold capitalize">
                {material.name}
              </span>
              <button
                onClick={() => setSelectedMaterial(material.id)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedMaterial === material.id
                    ? "border-white"
                    : "border-gray-400"
                }`}
                style={{ backgroundColor: material.color }}
              >
                {selectedMaterial === material.id && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto"></div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Magnet Strength Slider */}
        <div className="flex flex-col w-full gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Magnet Strength
          </span>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={magnetStrength}
              onChange={(e) => setMagnetStrength(parseInt(e.target.value))}
              className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          <span className="text-sm ml-2 w-12">{magnetStrength}%</span>
        </div>

        {/* Test button */}
        <div className="flex gap-5 items-center justify-center w-full">
          <button
            onClick={handleTest}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Material
          </button>
        </div>
      </div>

      {/* Test Result */}
    </div>
  );
};
