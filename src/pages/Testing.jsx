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
  const [magnetStrength, setMagnetStrength] = useState(0);
  const [ironAttached, setIronAttached] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [testedMaterials, setTestedMaterials] = useState([]);
  const [distanceData, setDistanceData] = useState([]);
  const [ironPosition, setIronPosition] = useState(0);
  const [sliderUsed, setSliderUsed] = useState(false);
  const [maxIronPosition, setMaxIronPosition] = useState(0);
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
    setMaxIronPosition(0); // Reset the max position
    setMaterialPositions({
      aluminum: { inBin: false, originalPos: { top: "25%", right: "10%" } },
      glass: { inBin: false, originalPos: { top: "75%", right: "10%" } },
    });
    setSliderUsed(false);
    setMagnetStrength(0);
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

      // Only update position if it would move iron further toward magnet
      if (attractionDistance > ironPosition) {
        setIronPosition(attractionDistance);
        setMaxIronPosition(attractionDistance);
      }

      // Only set as fully attached when strength is high enough
      if (magnetStrength > 70) {
        setIronAttached(true);
      } else {
        setIronAttached(false);
      }
    }
    // REMOVE THIS ENTIRE ELSE IF BLOCK!
    /* else if (magnetStrength === 0) {
    // Only reset position when strength is completely turned off
    setIronPosition(0);
    setMaxIronPosition(0);
    setIronAttached(false);
  } */
  }, [magnetStrength, ironPosition]);

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

    // Instead of setting a transparent image, use the actual element with offset
    // This will make it appear like you're holding the material
    // We need to create a clone of the element with proper size
    const material = materials.find((m) => m.id === materialId);
    const img = new Image();
    img.src = `${materialId}.png`;

    // Wait for the image to load before setting it as drag image
    img.onload = () => {
      // Set the drag image with proper offset to appear centered under cursor
      // const offsetX = img.width ;
      // const offsetY = img.height ;
      e.dataTransfer.setDragImage(img, offsetX, offsetY);
    };

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
  const recordAllMaterials = () => {
    // Record data for all materials
    materials.forEach((material) => recordTest(material.id));

    // Hard-code the iron distance data for the graph
    const ironData = [];
    for (let strength = 10; strength <= 100; strength += 10) {
      ironData.push({
        strength: strength,
        distance: Math.round(90 - strength * 0.85), // Distance decreases as strength increases
        material: "Iron",
      });
    }

    setDistanceData(ironData);

    // Switch to show the table tab first
    setActiveTab("table");

    // After 2 seconds, switch to show the graph
    setTimeout(() => {
      setActiveTab("graph");
    }, 2000);
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
                {materials.map((material) => (
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
  const handleSliderChange = (value) => {
    setMagnetStrength(value);
    if (!sliderUsed) {
      setSliderUsed(true);
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
          {/* Simulation Area */}
          <div className=" -rotate-90 h-[50%] absolute max-w-xl rounded-lg p-4 bottom-32 left-0 right-0 mx-auto ">
            {/* Container for simulation with aspect ratio */}
            <div className="relative w-full pt-[56.25%]">
              {" "}
              <div className="">
                {/* Magnetic Field Visualization */}
                <MagneticField strength={magnetStrength} />
                {/* Magnet */}
                <div className="absolute rotate-90  left-1/4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <img
                    src="magnet.png"
                    className="w-auto h-16 object-cover"
                    alt=""
                  />
                </div>

                {/* Bin for non-magnetic materials */}

                {/* Materials area - positioned on the right side */}
                <div className="absolute text-white font-bold right-[25%] top-0 h-full flex flex-col justify-evenly items-start">
                  {/* Aluminum - at the top */}

                  <div
                    style={{
                      backgroundImage: "url('aluminum.png')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      opacity: `${materialPositions.aluminum.inBin ? 0 : 1}`,
                    }}
                    draggable={sliderUsed}
                    onDragStart={(e) =>
                      sliderUsed && handleDragStart(e, "aluminum")
                    }
                    onDragEnd={handleDragEnd}
                    className={`relative rotate-90 flex items-center mb-2 ${
                      sliderUsed ? "cursor-move" : "cursor-default"
                    }`}
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
                      <div className="absolute  w-full text-center -bottom-6 ">
                        Aluminum
                      </div>
                    </div>
                  </div>

                  {/* Iron - in the middle (not draggable) */}
                  <div className="relative rotate-90 flex items-center mb-2">
                    <div
                      className="cursor-pointer flex items-center justify-center"
                      onClick={() => recordTest("iron")}
                      style={{
                        backgroundImage: "url('iron.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        top: `${ironPosition * 0.3}vmin`,
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

                  <div
                    style={{
                      backgroundImage: "url('glass.png')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      opacity: `${materialPositions.glass.inBin ? 0 : 1}`,
                    }}
                    draggable={sliderUsed} // Only draggable if slider has been used
                    onDragStart={(e) =>
                      sliderUsed && handleDragStart(e, "glass")
                    }
                    onDragEnd={handleDragEnd}
                    className={`relative rotate-90 flex items-center ${
                      sliderUsed ? "cursor-move" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className="flex items-center justify-center"
                      onClick={() => recordTest("glass")}
                      style={{
                        width: "8vmin",
                        height: "8vmin",
                        borderRadius: "50%",
                        position: "relative",
                        opacity: 0.8,
                        cursor: "move",
                      }}
                    >
                      <div className="absolute w-full text-center -bottom-6 text-xs sm:text-sm">
                        Glass
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bin for non-magnetic materials */}
              </div>
            </div>
          </div>
          {/* Control Panel */}
          <ControlPanel
            magnetStrength={magnetStrength}
            setMagnetStrength={handleSliderChange}
            resetExperiment={resetExperiment}
            recordTest={recordAllMaterials} // Use the new function instead
            sliderUsed={sliderUsed}
          />
          <div className="absolute bottom-0 right-0 w-fit text-center">
            <span className="font-bold text-sm px-2 py-1 rounded">
              Non-Magnetic Bin
            </span>
          </div>
          {/* Bin for non-magnetic materials */}
          <div
            style={{
              backgroundImage: "url('bin.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            className="absolute right-0 bottom-5 w-[15vmin] h-[15vmin] rounded-md flex flex-col items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div>
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
                    <span className=" font-bold text-xs">Aluminium</span>
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
                      opacity: 1,
                    }}
                  >
                    <span className="font-bold text-xs">Glass</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
  sliderUsed,
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

        <div className="flex gap-10 items-center justify-center">
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

const MagneticField = ({ strength }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pulseRef = useRef(0);

  // Initialize and animate the magnetic field
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // This controls the size of the canvas itself
    const resizeCanvas = () => {
      // Increase base size and use a higher multiplier to accommodate larger rings
      const size = Math.max(280, strength * 2.5);
      canvas.width = size;
      canvas.height = size;
    };

    resizeCanvas();

    // Draw magnetic field
    const drawMagneticField = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fieldStrength = Math.max(10, strength);

      // Calculate max safe radius to ensure rings stay visible
      // This ensures we never draw beyond 80% of the distance to canvas edge
      const maxSafeRadius = Math.min(centerX, centerY) * 0.9;

      // Scale factor to keep rings within bounds
      const largestTheoreticalRing = 40 + fieldStrength * (4 * 0.3 + 0.3) + 5;
      const scaleFactor =
        largestTheoreticalRing > maxSafeRadius
          ? maxSafeRadius / largestTheoreticalRing
          : 1;

      // Draw multiple field rings
      for (let i = 0; i < 5; i++) {
        // Calculate radius with pulsing effect
        let baseRadius = 20 + fieldStrength * (i * 0.2 + 0.2); // Reduced multiplier from 0.3 to 0.2
        let animationOffset = Math.sin(pulseRef.current - i * 0.5) * 5;
        let radius = (baseRadius + animationOffset) * scaleFactor; // Apply scale factor

        // Calculate opacity based on strength and ring number
        let alpha = Math.max(0.05, (fieldStrength / 100) * (0.5 - i * 0.1));

        // Set stroke style
        ctx.strokeStyle = `rgba(30, 64, 255, ${alpha})`;
        ctx.lineWidth = 2;

        // Draw ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glow for strongest ring
        if (i === 0 && strength > 50) {
          ctx.fillStyle = `rgba(30, 90, 255, ${alpha * 0.2})`;
          ctx.fill();
        }
      }

      // Add particles if strong enough - also apply scale factor
      if (strength > 30) {
        const particleCount = Math.floor(strength / 10);

        for (let i = 0; i < particleCount; i++) {
          const angle =
            pulseRef.current * 0.5 + (i / particleCount) * Math.PI * 2;
          const distance =
            (30 + strength * 0.2 + Math.sin(pulseRef.current + i) * 10) *
            scaleFactor;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;

          // Draw particle
          ctx.fillStyle = `rgba(100, 150, 255, ${0.3 + Math.random() * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Animation loop
    const animate = () => {
      pulseRef.current += 0.05;
      drawMagneticField();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [strength]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute w-[50%] object-contain h-[100%] left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        opacity: strength > 0 ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    />
  );
};
