import React, { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Materials data
const materials = [
  {
    id: "iron",
    name: "Iron",
    isMagnetic: true,
    attractionStrength: 0.9,
    color: "#808080",
  },
  {
    id: "aluminum",
    name: "Aluminum",
    isMagnetic: false,
    color: "#C0C0C0",
  },
  {
    id: "glass",
    name: "Glass",
    isMagnetic: false,
    color: "#ADD8E6",
  },
];

const MagneticPropertiesLab = () => {
  // Core state
  const [magnetStrength, setMagnetStrength] = useState(50);
  const [ironAttached, setIronAttached] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [testedMaterials, setTestedMaterials] = useState([]);
  const [distanceData, setDistanceData] = useState([]);
  const [ironPosition, setIronPosition] = useState(0);

  // Material positions state
  const [materialPositions, setMaterialPositions] = useState({
    aluminum: { inBin: false, originalPos: { top: "25%", right: "10%" } },
    glass: { inBin: false, originalPos: { top: "75%", right: "10%" } },
  });

  // Animation state
  const pulseRef = useRef(0);
  const animationRef = useRef(null);

  // Drag state
  const [draggedItem, setDraggedItem] = useState(null);

  // Reset experiment
  const resetExperiment = () => {
    setIronAttached(false);
    setIronPosition(0);
    setMaterialPositions({
      aluminum: { inBin: false, originalPos: { top: "25%", right: "10%" } },
      glass: { inBin: false, originalPos: { top: "75%", right: "10%" } },
    });
  };

  // Calculate iron movement speed based on magnet strength
  const calculateMovementSpeed = () => {
    // Returns a value between 0.5 and 2 seconds
    return 2 - (magnetStrength / 100) * 1.5;
  };

  // Monitor magnet strength changes to handle iron attraction
  useEffect(() => {
    if (magnetStrength > 20) {
      // Calculate how far the iron should move based on magnet strength
      const attractionDistance = Math.min(100, magnetStrength * 1.2);
      setIronPosition(attractionDistance);

      // Only set as fully attached when strength is high enough
      if (magnetStrength > 70) {
        setIronAttached(true);
      } else {
        setIronAttached(false);
      }
    } else {
      setIronPosition(0);
      setIronAttached(false);
    }
  }, [magnetStrength]);

  // Animation for magnetic field
  useEffect(() => {
    const animatePulse = () => {
      pulseRef.current += 0.1;
      animationRef.current = requestAnimationFrame(animatePulse);
    };

    animationRef.current = requestAnimationFrame(animatePulse);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Record test data
  const recordTest = (materialId) => {
    const material = materials.find((m) => m.id === materialId);

    // Add to tested materials if not already tested
    if (!testedMaterials.some((m) => m.id === material.id)) {
      setTestedMaterials([...testedMaterials, { ...material }]);

      // Generate distance data for magnetic materials
      if (material.isMagnetic) {
        const newDataPoints = [];
        for (let strength = 10; strength <= 100; strength += 10) {
          const distance = (100 - strength) * (1 - material.attractionStrength);
          newDataPoints.push({
            strength,
            distance,
            material: material.name,
          });
        }
        setDistanceData(newDataPoints);
      }
    }
  };

  // Drag handlers
  const handleDragStart = (e, materialId) => {
    if (materialId === "iron") return; // Cannot drag iron (it's controlled by magnet)
    setDraggedItem(materialId);

    // Set ghost drag image (optional)
    const material = materials.find((m) => m.id === materialId);
    const ghostImg = new Image();
    ghostImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // 1px transparent GIF
    e.dataTransfer.setDragImage(ghostImg, 0, 0);

    e.dataTransfer.setData("text/plain", materialId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const materialId = e.dataTransfer.getData("text/plain");

    if (materialId && materialId !== "iron") {
      setMaterialPositions((prev) => ({
        ...prev,
        [materialId]: {
          ...prev[materialId],
          inBin: true,
        },
      }));

      recordTest(materialId); // Record test for dropped material
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };
   
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
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">Material</th>
                  <th className="p-2 border border-gray-300">Magnetic</th>
                </tr>
              </thead>
              <tbody>
                {testedMaterials.map((material) => (
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
                ))}
              </tbody>
            </table>
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

  return (
    <div
      className="w-full bg-no-repeat bg-center bg-cover h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('page-two-bg.png')",
      }}
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          {/* Tabs */}
          <div className="md:absolute hidden md:block md:top-12 md:w-80 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
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
          ;{/* Simulation Area */}
          <div className="bg-white h-[50%] absolute max-w-xl border border-gray-300 rounded-lg p-4 overflow-hidden bottom-32 left-0 right-0 mx-auto shadow-lg">
            {/* Container for simulation with aspect ratio */}
            <div className="relative w-full pt-[56.25%]">
              {" "}
              {/* 16:9 aspect ratio */}
              <div className="">
                {/* Magnetic Field Visualization */}
                <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-blue-400 opacity-20"
                      style={{
                        width: `${(i + 1) * (5 + magnetStrength * 0.3)}vmin`,
                        height: `${(i + 1) * (5 + magnetStrength * 0.3)}vmin`,
                        left: `-${(i + 1) * (2.5 + magnetStrength * 0.15)}vmin`,
                        top: `-${(i + 1) * (2.5 + magnetStrength * 0.15)}vmin`,
                        animation: "pulse 2s infinite",
                      }}
                    />
                  ))}
                </div>
                {/* Magnet */}
                <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <div className="w-[8vmin] h-[20vmin] bg-red-500 rounded-l-lg flex flex-col justify-between">
                    <div className="w-full h-1/2 bg-red-600 rounded-tl-lg flex items-center justify-center text-white font-bold">
                      N
                    </div>
                    <div className="w-full h-1/2 bg-blue-600 rounded-bl-lg flex items-center justify-center text-white font-bold">
                      S
                    </div>
                  </div>
                </div>

                {/* Bin for non-magnetic materials */}

                {/* Materials area - positioned on the right side */}
                <div className="absolute right-[25%] top-0 h-full flex flex-col justify-evenly items-start">
                  {/* Aluminum - at the top */}
                  {!materialPositions.aluminum.inBin && (
                    <div
                      style={{
                        backgroundImage: "url('aluminum.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "aluminum")}
                      onDragEnd={handleDragEnd}
                      className="relative flex items-center mb-2 cursor-move"
                    >
                      <div
                        className="flex items-center justify-center"
                        onClick={() => recordTest("aluminum")}
                        style={{
                          // backgroundColor: materials[1].color,
                          width: "8vmin",
                          height: "8vmin",
                          borderRadius: "50%",
                          position: "relative",
                          // border: "2px solid #555",
                          cursor: "move",
                        }}
                      >
                        <div className="absolute w-full text-center -bottom-6 text-xs sm:text-sm">
                          Aluminum
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Iron - in the middle (not draggable) */}
                  <div className="relative flex items-center mb-2">
                    <div
                      className="cursor-pointer flex items-center justify-center"
                      onClick={() => recordTest("iron")}
                      style={{
                        backgroundImage: "url('iron.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        right: `${ironPosition * 0.3}vmin`,
                        width: "8vmin",
                        height: "8vmin",
                        borderRadius: "50%",
                        position: "relative",
                        transition: `right ${calculateMovementSpeed()}s ${
                          ironAttached ? "ease-in" : "ease-out"
                        }`,
                        transform: ironAttached ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <div className="absolute w-full text-center -bottom-6 text-xs sm:text-sm">
                        Iron
                      </div>
                    </div>
                  </div>

                  {/* Glass - at the bottom */}
                  {!materialPositions.glass.inBin && (
                    <div
                      style={{
                        backgroundImage: "url('glass.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "glass")}
                      onDragEnd={handleDragEnd}
                      className="relative flex items-center cursor-move"
                    >
                      <div
                        className="flex items-center justify-center"
                        onClick={() => recordTest("glass")}
                        style={{
                          // backgroundColor: materials[2].color,
                          width: "8vmin",
                          height: "8vmin",
                          borderRadius: "50%",
                          position: "relative",
                          // border: "2px solid #555",
                          opacity: 0.8,
                          cursor: "move",
                        }}
                      >
                        <div className="absolute w-full text-center -bottom-6 text-xs sm:text-sm">
                          Glass
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Bin for non-magnetic materials */}
                <div
                  style={{
                    backgroundImage: "url('bin.png')",
                    backgroundSize: "contain",
                  }}
                  className="absolute -right-5 bottom-0 w-[12vmin] h-[12vmin] rounded-md flex flex-col items-center justify-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {/* Display items in the bin */}
                  <div className="absolute ">
                    {materialPositions.aluminum.inBin && (
                      <div
                        className="m-1 flex items-center justify-center"
                        style={{
                          backgroundImage: "url('aluminum.png')",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          width: "5vmin",
                          height: "5vmin",
                        }}
                      >
                        <span className="text-gray-700 font-bold text-xs">
                          Al
                        </span>
                      </div>
                    )}

                    {materialPositions.glass.inBin && (
                      <div
                        className="m-1 flex items-center justify-center"
                        style={{
                          backgroundImage: "url('glass.png')",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          width: "6vmin",
                          height: "6vmin",
                          opacity: 1.8,
                        }}
                      >
                        <span className="text-gray-700 font-bold text-xs">
                          Si
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Control Panel */}
          <ControlPanel
            magnetStrength={magnetStrength}
            setMagnetStrength={setMagnetStrength}
            resetExperiment={resetExperiment}
          />
        </div>
      </div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4">
          Magnetic Properties Lab
        </h1>

        {/* Control panel */}
      </div>

      {/* Add keyframe animation for magnetic field pulse */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.7;
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
  resetExperiment,
  recordTest,
}) => {
  return (
    <div className="space-y-6 absolute  md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 px-16 z-50 text-white p-3 rounded-lg shadow-lg flex justify-center items-center md:gap-16 gap-5">
        {/* Magnet Strength Slider */}
        <div className="flex flex-col  gap-2 justify-center items-center">
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

        {/* Reset button */}

        <div className="flex gap-10 items-center justify-center  ">
          <button
            onClick={recordTest}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Record Test
          </button>
          <button
            onClick={resetExperiment}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};




