import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Material definitions with properties
const MATERIALS = [
  {
    id: "iron",
    name: "Iron",
    isMagnetic: true,
    color: "#a19d94",
    attractionFactor: 0.9,
  },
  {
    id: "aluminum",
    name: "Aluminum",
    isMagnetic: false,
    color: "#d6d6d6",
    attractionFactor: 0,
  },
  {
    id: "glass",
    name: "Glass",
    isMagnetic: false,
    color: "#add8e6",
    attractionFactor: 0,
  },
];

const MagnetismSimulation = () => {
  const [magnetStrength, setMagnetStrength] = useState(50);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [testResults, setTestResults] = useState([]);
  const [testInProgress, setTestInProgress] = useState(false);
  const [materialPosition, setMaterialPosition] = useState({ x: 250, y: 150 });
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  // Run test for material with current magnet strength
  const runTest = () => {
    setTestInProgress(true);

    // Simulate test duration
    setTimeout(() => {
      const newResult = {
        id: Date.now(),
        material: selectedMaterial.name,
        magnetStrength,
        isAttracted: selectedMaterial.isMagnetic,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTestResults([...testResults, newResult]);

      // Generate graph data points for magnetic materials
      if (selectedMaterial.isMagnetic) {
        const newGraphData = [];
        for (let distance = 10; distance <= 100; distance += 10) {
          // Calculate attraction force based on inverse square law
          const force =
            ((magnetStrength * selectedMaterial.attractionFactor) /
              (distance * distance)) *
            1000;
          newGraphData.push({
            distance,
            force: Math.round(force),
          });
        }
        setGraphData(newGraphData);
        setShowGraph(true);
      }

      setTestInProgress(false);
    }, 1500);
  };
  // Classify the currently selected material
  const classifyMaterial = (bin) => {
    const correct =
      (bin === "magnetic" && selectedMaterial.isMagnetic) ||
      (bin === "nonmagnetic" && !selectedMaterial.isMagnetic);

    alert(
      `Classification ${correct ? "CORRECT!" : "INCORRECT!"} ${
        selectedMaterial.name
      } is ${selectedMaterial.isMagnetic ? "magnetic" : "non-magnetic"}.`
    );
  };

  return (
    <div
      style={{
        backgroundImage: "url('magnetisim/bg-image.png')",
      }}
      className="w-full bg-no-repeat bg-center bg-cover h-screen"
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6 ">
          {/* tabs */}

          {/* Control Panel */}
          <ControlPanel
            magnetStrength={magnetStrength}
            setMagnetStrength={setMagnetStrength}
            MATERIALS={MATERIALS}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            testInProgress={testInProgress}
            runTest={runTest}
          />
          <div className=" ">
            {/* Lab background images */}

            {/* Experiment Table */}

            {/* Magnet */}
            <div
              className="absolute "
              style={{
                left: "100px",
                top: "120px",
                width: "60px",
                height: "30px",
                background: "linear-gradient(to right, red, white, red)",
                borderRadius: "5px",
                transform: "rotate(0deg)",
                boxShadow: `0 0 ${magnetStrength / 2}px ${
                  magnetStrength / 10
                }px rgba(255,0,0,0.3)`,
              }}
            >
              <div className="absolute inset-0 flex justify-center items-center font-bold text-xs">
                N S
              </div>
            </div>

            {/* Material */}
            <div
              className="absolute cursor-move"
              style={{
                left: `${materialPosition.x}px`,
                top: `${materialPosition.y}px`,
                width: "40px",
                height: "40px",
                backgroundColor: selectedMaterial.color,
                borderRadius: "4px",
                transition: testInProgress
                  ? "transform 1.5s, left 1.5s"
                  : "none",
                transform:
                  testInProgress && selectedMaterial.isMagnetic
                    ? "translateX(-150px)"
                    : "translateX(0)",
              }}
            ></div>

            {/* Magnetic field visualization */}
            {testInProgress && selectedMaterial.isMagnetic && (
              <div className="absolute left-[110px] top-[115px] w-[150px] h-[40px] pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-[40px] border-l border-dashed border-red-500 opacity-70"
                    style={{
                      left: `${i * 30}px`,
                      animation: `pulse 1s infinite ${i * 0.2}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
          <div className="flex absolute left-[40%] bottom-28 justify-center gap-8 mb-4">
            <div
              className="w-32 h-24 bg-red-100 border-2 border-dashed border-red-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-red-200"
              onClick={() => classifyMaterial("magnetic")}
            >
              <div className="text-center">
                <div className="font-bold text-red-500">Magnetic</div>
                <div className="text-xs text-red-400">Drop here</div>
              </div>
            </div>

            <div
              className="w-32 h-24 bg-blue-100 border-2 border-dashed border-blue-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-200"
              onClick={() => classifyMaterial("nonmagnetic")}
            >
              <div className="text-center">
                <div className="font-bold text-blue-500">Non-Magnetic</div>
                <div className="text-xs text-blue-400">Drop here</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagnetismSimulation;

const ControlPanel = ({
  magnetStrength,
  setMagnetStrength,
  MATERIALS,
  selectedMaterial,
  setSelectedMaterial,
  testInProgress,
  runTest,
  recordData,
}) => {
  return (
    <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 w-full z-50 text-white p-3 rounded-lg shadow-lg grid grid-cols-3 justify-center items-center md:gap-10 gap-5">
        {/* Material Selector */}

        <div className="flex flex-col w-full gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Select Material
          </span>
          <div className="flex flex-wrap  gap-2 justify-center">
            {MATERIALS.map((material) => (
              <button
                key={material.id}
                onClick={() => setSelectedMaterial(material)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedMaterial?.id === material.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-400 text-gray-900"
                }`}
              >
                {material.name}
              </button>
            ))}
          </div>
        </div>

        {/* Magnet Strength Slider */}
        <div className="flex flex-col max-w-32 gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Magnet Strength
          </span>
          <div className="flex items-center w-full">
            <input
              type="range"
              min="10"
              max="100"
              value={magnetStrength}
              onChange={(e) => setMagnetStrength(parseInt(e.target.value))}
              className=" h-1 bg-gray-300 rounded-lg cursor-pointer accent-orange-500"
            />
          </div>
          <span className="text-sm ml-2 w-12">{magnetStrength}%</span>
        </div>

        {/* Test & Record Buttons */}
        <div className="flex gap-5 items-center justify-center w-full">
          <button
            onClick={runTest}
            disabled={testInProgress}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
              testInProgress ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {testInProgress ? "Testing..." : "Test Magnetic Attraction"}
          </button>
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




















// {
//   const renderTabContent = (tab) => {
//     if (!activeTab || activeTab !== tab) return null;

//     if ((tab === "table" || tab === "graph") && testResults.length === 0) {
//       return (
//         <div className="bg-white p-4 rounded-lg shadow-lg">
//           No recorded data to show. Record some data by clicking the "Record
//           Data" button!
//         </div>
//       );
//     }

//     switch (tab) {
//       case "description":
//         return (
//           <div className="p-4">
//             <h2 className="text-sm font-semibold mb-2">About Magnetism</h2>
//             <p className="mb-2">
//               Magnetism is a force that attracts specific materials.
//               Ferromagnetic materials like iron are strongly attracted to
//               magnets, while materials like aluminum and glass show little to no
//               magnetic response.
//             </p>
//           </div>
//         );
//       case "table":
//         return (
//           <div className="bg-white rounded-lg shadow-lg p-4">
//             <h2 className="text-xl font-semibold mb-2">Test Results</h2>
//             <div className="overflow-auto max-h-64">
//               <table className="min-w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-2 text-left border border-gray-200">
//                       Material
//                     </th>
//                     <th className="p-2 text-left border border-gray-200">
//                       Magnet Strength
//                     </th>
//                     <th className="p-2 text-left border border-gray-200">
//                       Result
//                     </th>
//                     <th className="p-2 text-left border border-gray-200">
//                       Time
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {testResults.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="p-4 text-center text-gray-500">
//                         No tests run yet
//                       </td>
//                     </tr>
//                   ) : (
//                     testResults.map((result) => (
//                       <tr key={result.id}>
//                         <td className="p-2 border border-gray-200">
//                           {result.material}
//                         </td>
//                         <td className="p-2 border border-gray-200">
//                           {result.magnetStrength}%
//                         </td>
//                         <td className="p-2 border border-gray-200">
//                           <span
//                             className={
//                               result.isAttracted
//                                 ? "text-green-600"
//                                 : "text-red-600"
//                             }
//                           >
//                             {result.isAttracted ? "Attracted" : "Not Attracted"}
//                           </span>
//                         </td>
//                         <td className="p-2 border border-gray-200 text-xs">
//                           {result.timestamp}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );
//       case "graph":
//         return (
//           <div className="bg-white rounded-lg shadow-lg p-4">
//             <h2 className="text-xl font-semibold mb-2">Magnetic Force Graph</h2>
//             {showGraph ? (
//               <ResponsiveContainer width="100%" height={220}>
//                 <LineChart
//                   data={graphData}
//                   margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="distance"
//                     label={{
//                       value: "Distance (mm)",
//                       position: "bottom",
//                       offset: -5,
//                     }}
//                   />
//                   <YAxis
//                     label={{
//                       value: "Force (mN)",
//                       angle: -90,
//                       position: "insideLeft",
//                     }}
//                   />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="force"
//                     name="Magnetic Force"
//                     stroke="#8884d8"
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-[220px] flex items-center justify-center text-gray-400">
//                 Test a magnetic material to see force vs. distance graph
//               </div>
//             )}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   <div className="md:absolute hidden md:block md:top-12 md:w-96 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
//     {["description", "table", "graph"].map((tab) => (
//       <div key={tab} className="border-b">
//         <button
//           className="w-full text-left px-4 py-2 bg-blue-200 hover:bg-blue-300"
//           onClick={() => setActiveTab(activeTab === tab ? null : tab)}
//         >
//           {tab.toUpperCase()}
//         </button>
//         {renderTabContent(tab)}
//       </div>
//     ))}
//   </div>;
// }
