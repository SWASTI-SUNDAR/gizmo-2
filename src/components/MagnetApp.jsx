import React, { useState, useEffect } from "react";
import MaterialControls from "./MaterialControls";
import MessageDisplay from "./MessageDisplay";
import ExperimentArea from "./ExperimentArea";
import DataTable from "./DataTable";
import MagnetGraph from "./MagnetGraph";
import { materialsData, originalPositions } from "../data/materialsData";

const MagnetApp = () => {
  // State for magnetic strength
  const [magneticStrength, setMagneticStrength] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [message, setMessage] = useState(
    "Adjust the magnetic strength and test the materials"
  );
  const [showError, setShowError] = useState(false);

  // State to track where materials are
  const [materialsState, setMaterialsState] = useState({
    iron: { location: "workspace", position: { x: 80, y: 150 } },
    aluminum: { location: "workspace", position: { x: 80, y: 220 } },
    glass: { location: "workspace", position: { x: 80, y: 290 } },
  });

  // State for test results data
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  // State for graph data
  const [graphData, setGraphData] = useState([]);

  // Handle slider change
  const handleSliderChange = (e) => {
    setMagneticStrength(parseInt(e.target.value));
  };

  // Handle test button click
  const handleTest = () => {
    // Only allow testing if all materials are in workspace
    if (
      Object.values(materialsState).some(
        (item) => item.location !== "workspace"
      )
    ) {
      setMessage("Please reset the experiment before testing again.");
      return;
    }

    setIsTestActive(true);
    setMessage("Testing magnetic attraction...");

    // Reset graph data for new test
    setGraphData([]);

    // Initialize test results
    const initialResults = {};
    materialsData.forEach((material) => {
      initialResults[material.id] = {
        attracted: material.isMagnetic && magneticStrength > 0,
        force: material.isMagnetic ? (magneticStrength / 100) * 10 : 0, // Simple force calculation
      };
    });
    setTestResults(initialResults);

    setTimeout(() => {
      setIsTestActive(false);
      setMessage(
        "Test complete! Now sort the materials into the correct bins."
      );
    }, 3000);
  };

  // Reset experiment
  const handleReset = () => {
    setMagneticStrength(0);
    setIsTestActive(false);
    setMessage("Adjust the magnetic strength and test the materials");
    setShowError(false);
    setTestResults(null);
    setGraphData([]);

    // Reset all materials
    const resetState = {};
    materialsData.forEach((material) => {
      resetState[material.id] = {
        location: "workspace",
        position: { ...originalPositions[material.id] },
      };
    });

    setMaterialsState(resetState);
  };

  // Animation effect for magnetic materials - with data collection
  useEffect(() => {
    if (!isTestActive) return;

    const magnetPos = { x: 350, y: 220 };
    const dataPoints = [];
    let frameCount = 0;

    const interval = setInterval(() => {
      frameCount++;

      setMaterialsState((prev) => {
        const newState = { ...prev };

        materialsData.forEach((material) => {
          if (
            material.isMagnetic &&
            prev[material.id].location === "workspace"
          ) {
            // Calculate attraction based on magnetic strength
            const moveRate = magneticStrength / 100;

            // Current position
            const pos = prev[material.id].position;

            // Vector to magnet
            const dx = magnetPos.x - pos.x;
            const dy = magnetPos.y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate force based on distance and strength (inverse square law)
            const force =
              moveRate * (10000 / Math.max(distance * distance, 100));

            // Only collect data every 5 frames to avoid too many points
            if (frameCount % 5 === 0 && material.id === "iron") {
              dataPoints.push({
                distance: Math.round(distance),
                force: force,
                time: Date.now(),
              });

              // Update the graph with latest data
              setGraphData([...dataPoints]);
            }

            if (distance > 50) {
              // Keep some minimum distance
              // Calculate new position
              const newPos = {
                x: pos.x + (dx / distance) * moveRate * 5,
                y: pos.y + (dy / distance) * moveRate * 5,
              };

              // Add shaking effect
              if (moveRate > 0.3) {
                newPos.x += (Math.random() - 0.5) * moveRate * 6;
                newPos.y += (Math.random() - 0.5) * moveRate * 6;
              }

              // Update position
              newState[material.id].position = newPos;
            }
          }
        });

        return newState;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isTestActive, magneticStrength]);

  // Show error message temporarily
  const showErrorMessage = (message) => {
    setMessage(message);
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
      setMessage("Try again. Sort each material into the correct bin.");
    }, 2000);
  };

  // Check if all materials are sorted correctly
  useEffect(() => {
    const allSorted = materialsData.every((material) => {
      if (material.isMagnetic) {
        return materialsState[material.id].location === "magneticBin";
      } else {
        return materialsState[material.id].location === "nonMagneticBin";
      }
    });

    if (
      allSorted &&
      Object.values(materialsState).every(
        (item) => item.location !== "workspace"
      )
    ) {
      setMessage(
        "Excellent! You've successfully sorted all materials. Click Reset to try again."
      );
    }
  }, [materialsState]);

  // Handle dropping a material into a bin
  const handleMaterialDrop = (itemId, binType) => {
    const material = materialsData.find((m) => m.id === itemId);

    if (binType === "magneticBin" && material.isMagnetic) {
      setMaterialsState((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          location: "magneticBin",
          position: { x: 500, y: 130 },
        },
      }));
      setMessage(`Correct! ${material.name} is magnetic.`);
      return true;
    } else if (binType === "nonMagneticBin" && !material.isMagnetic) {
      setMaterialsState((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          location: "nonMagneticBin",
          position: { x: 500, y: 280 },
        },
      }));
      setMessage(`Correct! ${material.name} is not magnetic.`);
      return true;
    } else if (binType === "magneticBin") {
      showErrorMessage(
        `Error: ${material.name} is not magnetic and cannot go in the magnetic bin!`
      );
      return false;
    } else {
      showErrorMessage(
        `Error: ${material.name} is magnetic and cannot go in the non-magnetic bin!`
      );
      return false;
    }
  };
  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;

    if ((tab === "table" || tab === "graph") && !testResults) {
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
          <div className="p-3">
            1. Adjust magnet strength
            <br />
            2. Test the attraction
            <br />
            3. Sort materials into correct bins
          </div>
        );
      case "table":
        return (
          <div className="bg-white max-h-80">
            <DataTable materials={materialsData} testResults={testResults} />
          </div>
        );
      case "graph":
        return (
          <div className="p-4 rounded-lg h-52">
            <MagnetGraph graphData={graphData} />
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
          ;
          <MaterialControls
            magneticStrength={magneticStrength}
            onChange={handleSliderChange}
            onTest={handleTest}
            onReset={handleReset}
            isTestActive={isTestActive}
          />
          ;
          <div className="absolute bottom-24  ">
            <MessageDisplay message={message} isError={showError} />
          </div>
          <div className="w-full flex flex-col md:flex-row gap-4 mt-8">
            <div className="w-full md:w-1/2"> </div>
            <div className="w-full md:w-1/2">
              <ExperimentArea
                materials={materialsData}
                materialsState={materialsState}
                isTestActive={isTestActive}
                magneticStrength={magneticStrength}
                onDrop={handleMaterialDrop}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagnetApp;


