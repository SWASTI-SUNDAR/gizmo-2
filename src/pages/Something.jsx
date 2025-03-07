import React, { useState, useRef, useEffect } from "react";
import { AlertCircle } from "lucide-react";

const MagneticMaterialsSimulator = () => {
  const [magneticStrength, setMagneticStrength] = useState(0);
  const [testMode, setTestMode] = useState(true); // true = attraction test, false = sorting test
  const [materials, setMaterials] = useState([
    {
      id: "iron",
      name: "Iron",
      position: { x: 100, y: 100 },
      isMagnetic: true,
    },
    {
      id: "aluminum",
      name: "Aluminum",
      position: { x: 200, y: 100 },
      isMagnetic: false,
    },
    {
      id: "glass",
      name: "Glass",
      position: { x: 300, y: 100 },
      isMagnetic: false,
    },
  ]);
  const [draggingMaterial, setDraggingMaterial] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);

  const magnetRef = useRef(null);
  const containerRef = useRef(null);
  const magneticBinRef = useRef(null);
  const nonMagneticBinRef = useRef(null);

  // Function to calculate distance between magnet and material
  const getDistanceToMagnet = (materialPos) => {
    if (!magnetRef.current) return 1000;

    const magnetRect = magnetRef.current.getBoundingClientRect();
    const magnetPos = {
      x: magnetRect.left + magnetRect.width / 2,
      y: magnetRect.top + magnetRect.height / 2,
    };

    const containerRect = containerRef.current.getBoundingClientRect();
    const materialAbsolutePos = {
      x: containerRect.left + materialPos.x,
      y: containerRect.top + materialPos.y,
    };

    return Math.sqrt(
      Math.pow(magnetPos.x - materialAbsolutePos.x, 2) +
        Math.pow(magnetPos.y - materialAbsolutePos.y, 2)
    );
  };

  // Update material positions based on magnetic attraction
  useEffect(() => {
    if (!testMode) return;

    const updatePositions = () => {
      setMaterials((prevMaterials) =>
        prevMaterials.map((material) => {
          if (!material.isMagnetic) return material;

          const distance = getDistanceToMagnet(material.position);
          const attractionForce = material.isMagnetic
            ? magneticStrength / 5
            : 0;
          const maxAttractionDistance = 300;

          if (distance < maxAttractionDistance && attractionForce > 0) {
            const magnetRect = magnetRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const magnetPos = {
              x: magnetRect.left - containerRect.left + magnetRect.width / 2,
              y: magnetRect.top - containerRect.top + magnetRect.height / 2,
            };

            // Calculate direction vector
            const dirX = magnetPos.x - material.position.x;
            const dirY = magnetPos.y - material.position.y;
            const length = Math.sqrt(dirX * dirX + dirY * dirY);

            if (length === 0) return material;

            // Normalize and apply force
            const moveX = (dirX / length) * attractionForce;
            const moveY = (dirY / length) * attractionForce;

            return {
              ...material,
              position: {
                x: material.position.x + moveX,
                y: material.position.y + moveY,
              },
            };
          }

          return material;
        })
      );
    };

    const interval = setInterval(updatePositions, 50);
    return () => clearInterval(interval);
  }, [magneticStrength, testMode]);

  const handleMaterialMouseDown = (e, material) => {
    e.preventDefault();
    const containerRect = containerRef.current.getBoundingClientRect();
    setDraggingMaterial(material);
    setDragOffset({
      x: e.clientX - containerRect.left - material.position.x,
      y: e.clientY - containerRect.top - material.position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingMaterial) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newPosX = e.clientX - containerRect.left - dragOffset.x;
    const newPosY = e.clientY - containerRect.top - dragOffset.y;

    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === draggingMaterial.id
          ? { ...material, position: { x: newPosX, y: newPosY } }
          : material
      )
    );
  };

  const handleMouseUp = (e) => {
    if (!draggingMaterial || testMode) {
      setDraggingMaterial(null);
      return;
    }

    // Check if material is dropped in a bin
    const checkBinDrop = (binRef, expectedMagnetic) => {
      if (!binRef.current) return false;

      const binRect = binRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const materialPos = {
        x: containerRect.left + draggingMaterial.position.x,
        y: containerRect.top + draggingMaterial.position.y,
      };

      return (
        materialPos.x > binRect.left &&
        materialPos.x < binRect.right &&
        materialPos.y > binRect.top &&
        materialPos.y < binRect.bottom &&
        draggingMaterial.isMagnetic === expectedMagnetic
      );
    };

    const isCorrectMagneticBin = checkBinDrop(magneticBinRef, true);
    const isCorrectNonMagneticBin = checkBinDrop(nonMagneticBinRef, false);
    const isWrongMagneticBin = checkBinDrop(magneticBinRef, false);
    const isWrongNonMagneticBin = checkBinDrop(nonMagneticBinRef, true);

    if (isCorrectMagneticBin || isCorrectNonMagneticBin) {
      // Remove material from list if correctly sorted
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => material.id !== draggingMaterial.id)
      );
      setError(null);
    } else if (isWrongMagneticBin || isWrongNonMagneticBin) {
      setError(
        `Error: ${draggingMaterial.name} is ${
          draggingMaterial.isMagnetic ? "magnetic" : "non-magnetic"
        } and belongs in the ${
          draggingMaterial.isMagnetic ? "magnetic" : "non-magnetic"
        } bin.`
      );
    }

    setDraggingMaterial(null);
  };

  const handleEndTest = () => {
    setTestMode(false);
    // Reset positions for sorting test
    setMaterials([
      {
        id: "iron",
        name: "Iron",
        position: { x: 100, y: 150 },
        isMagnetic: true,
      },
      {
        id: "aluminum",
        name: "Aluminum",
        position: { x: 200, y: 150 },
        isMagnetic: false,
      },
      {
        id: "glass",
        name: "Glass",
        position: { x: 300, y: 150 },
        isMagnetic: false,
      },
    ]);
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Magnetic Materials Simulator</h1>

      {testMode ? (
        <>
          <div className="mb-6 w-full">
            <label className="block mb-2 font-medium">
              Magnetic Strength: {magneticStrength}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={magneticStrength}
              onChange={(e) => setMagneticStrength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div
            ref={containerRef}
            className="relative w-full h-64 border-2 border-gray-300 rounded-lg bg-white mb-4"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Magnet */}
            <div
              ref={magnetRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-red-600 rounded-b-full relative">
                  <div className="w-16 h-4 bg-gray-200 absolute -top-4 rounded-t-md"></div>
                  <div className="absolute -top-8 left-2 text-yellow-400 font-bold text-2xl">
                    ⚡
                  </div>
                  <div className="absolute -top-8 right-2 text-yellow-400 font-bold text-2xl">
                    ⚡
                  </div>
                </div>
              </div>
            </div>

            {/* Materials */}
            {materials.map((material) => (
              <div
                key={material.id}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: `${material.position.x}px`,
                  top: `${material.position.y}px`,
                  transform: "translate(-50%, -50%)",
                  transition:
                    draggingMaterial?.id === material.id ? "none" : "all 0.2s",
                }}
                onMouseDown={(e) => handleMaterialMouseDown(e, material)}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center font-bold text-xs text-center`}
                >
                  <div
                    className={`w-12 h-12 transform rotate-45 ${
                      material.id === "iron"
                        ? "bg-gray-700"
                        : material.id === "aluminum"
                        ? "bg-gray-400"
                        : "bg-gray-100"
                    }`}
                  ></div>
                  <span className="absolute text-white">{material.name}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleEndTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            End Test & Sort Materials
          </button>
        </>
      ) : (
        <>
          <p className="mb-4 text-center">
            Now sort the materials by dragging them into the correct bins based
            on whether they are magnetic or not.
          </p>

          <div
            ref={containerRef}
            className="relative w-full h-64 border-2 border-gray-300 rounded-lg bg-white mb-4"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Materials */}
            {materials.map((material) => (
              <div
                key={material.id}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: `${material.position.x}px`,
                  top: `${material.position.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={(e) => handleMaterialMouseDown(e, material)}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center font-bold text-xs text-center`}
                >
                  <div
                    className={`w-12 h-12 transform rotate-45 ${
                      material.id === "iron"
                        ? "bg-gray-700"
                        : material.id === "aluminum"
                        ? "bg-gray-400"
                        : "bg-gray-100"
                    }`}
                  ></div>
                  <span className="absolute text-white">{material.name}</span>
                </div>
              </div>
            ))}

            {/* Bins */}
            <div
              ref={magneticBinRef}
              className="absolute bottom-4 left-1/4 transform -translate-x-1/2 w-32 h-20 bg-blue-100 border-2 border-blue-500 rounded-md flex items-center justify-center"
            >
              <span className="text-center font-medium text-blue-700">
                Magnetic
              </span>
            </div>

            <div
              ref={nonMagneticBinRef}
              className="absolute bottom-4 right-1/4 transform translate-x-1/2 w-32 h-20 bg-gray-100 border-2 border-gray-500 rounded-md flex items-center justify-center"
            >
              <span className="text-center font-medium text-gray-700">
                Non-Magnetic
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center p-2 mb-4 bg-red-100 border border-red-300 rounded-md text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {materials.length === 0 && (
            <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
              Great job! You've correctly sorted all materials.
            </div>
          )}

          <button
            onClick={() => {
              setTestMode(true);
              setMaterials([
                {
                  id: "iron",
                  name: "Iron",
                  position: { x: 100, y: 100 },
                  isMagnetic: true,
                },
                {
                  id: "aluminum",
                  name: "Aluminum",
                  position: { x: 200, y: 100 },
                  isMagnetic: false,
                },
                {
                  id: "glass",
                  name: "Glass",
                  position: { x: 300, y: 100 },
                  isMagnetic: false,
                },
              ]);
              setError(null);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Restart Experiment
          </button>
        </>
      )}
    </div>
  );
};

export default MagneticMaterialsSimulator;
