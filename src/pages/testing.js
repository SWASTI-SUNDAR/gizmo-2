// {
// }
{
  /* Educational Information */
}
<div className="w-full max-w-4xl mt-6 bg-white rounded-lg shadow-lg p-6">
  <h2 className="text-xl font-semibold mb-2">About Magnetism</h2>
  <p className="mb-2">
    Magnetism is a force that attracts specific materials. Ferromagnetic
    materials like iron are strongly attracted to magnets, while materials like
    aluminum and glass show little to no magnetic response.
  </p>
  <p>
    The strength of magnetic attraction follows the inverse square law - the
    force decreases rapidly as distance increases. Try different materials and
    magnet strengths to see how they interact!
  </p>
</div>;

// import React, { useState, useEffect } from "react";
// import { Magnet, Box, Activity } from "lucide-react";

// const MagnetismExplorer = () => {
//   const [magnetStrength, setMagnetStrength] = useState(50);
//   const [currentMaterial, setCurrentMaterial] = useState("iron");
//   const [showParticles, setShowParticles] = useState(false);
//   const [testResults, setTestResults] = useState([]);
//   const [testInProgress, setTestInProgress] = useState(false);
//   const [showBin, setShowBin] = useState(false);
//   const [materialPosition, setMaterialPosition] = useState({ x: 0, y: 0 });
//   const [binDecision, setBinDecision] = useState(null);

//   const materials = {
//     iron: { name: "Iron", color: "bg-gray-600", isMagnetic: true },
//     aluminum: { name: "Aluminum", color: "bg-gray-400", isMagnetic: false },
//     glass: { name: "Glass", color: "bg-blue-200", isMagnetic: false },
//   };

//   const runTest = () => {
//     setTestInProgress(true);
//     setShowParticles(true);

//     setTimeout(() => {
//       const result = {
//         material: currentMaterial,
//         materialName: materials[currentMaterial].name,
//         isAttracted: materials[currentMaterial].isMagnetic,
//         strength: magnetStrength,
//         timestamp: new Date().toLocaleTimeString(),
//       };

//       setTestResults((prev) => [result, ...prev]);
//       setShowBin(true);
//       setBinDecision(materials[currentMaterial].isMagnetic);
//       setTestInProgress(false);
//     }, 1500);
//   };

//   const resetTest = () => {
//     setShowParticles(false);
//     setShowBin(false);
//     setMaterialPosition({ x: 0, y: 0 });
//   };

//   const handleMaterialChange = (material) => {
//     resetTest();
//     setCurrentMaterial(material);
//   };

//   useEffect(() => {
//     if (showBin) {
//       const timer = setTimeout(() => {
//         setMaterialPosition({ x: binDecision ? 100 : -100, y: 150 });
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [showBin, binDecision]);

//   // Generate magnetic field particles
//   const renderParticles = () => {
//     if (!showParticles) return null;

//     const particleCount = Math.floor(magnetStrength / 5);
//     const particles = [];
//     const isMagnetic = materials[currentMaterial].isMagnetic;

//     for (let i = 0; i < particleCount; i++) {
//       const direction = isMagnetic ? -1 : Math.random() > 0.5 ? -1 : 1;
//       const distance = isMagnetic ? 20 + (i % 3) * 15 : 10 + Math.random() * 60;
//       const delay = i * 50;

//       particles.push(
//         <div
//           key={i}
//           className={`absolute h-1 w-1 rounded-full bg-yellow-300 opacity-70`}
//           style={{
//             left: `calc(50% + ${120 * direction}px)`,
//             top: `calc(50% + ${distance}px)`,
//             animation: isMagnetic
//               ? `particleAttracted${i} 1s ${delay}ms forwards`
//               : `particleRandom${i} 2s ${delay}ms infinite`,
//           }}
//         />
//       );
//     }
//     return (
//       <div className="absolute inset-0 overflow-hidden">
//         {particles}
//         <style jsx>{`
//           ${particles
//             .map((_, i) => {
//               const distance = isMagnetic
//                 ? 20 + (i % 3) * 15
//                 : 10 + Math.random() * 60;
//               return `
//               @keyframes particleAttracted${i} {
//                 to {
//                   transform: translateX(${70}px) translateY(-${distance}px);
//                 }
//               }
//               @keyframes particleRandom${i} {
//                 0%, 100% {
//                   transform: translateX(0) translateY(0);
//                 }
//                 50% {
//                   transform: translateX(${Math.random() * 20 - 10}px)
//                     translateY(${Math.random() * 20 - 10}px);
//                 }
//               }
//             `;
//             })
//             .join("\n")}
//         `}</style>
//       </div>
//     );
//   };

//   return (
//     <div className="relative flex flex-col items-center w-full h-full bg-blue-100 p-4 overflow-hidden">
//       {/* Title Bar */}
//       <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white p-4 text-center font-bold text-xl">
//         Magnetism: Exploring Magnetic Forces
//       </div>

//       {/* Main Content */}
//       <div className="flex w-full h-full mt-16 gap-4">
//         {/* Center - Visualization */}
//         <div className="flex-1 relative bg-blue-500 rounded-lg shadow-lg flex justify-center items-center">
//           {/* Magnet */}
//           <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
//             <div className="relative">
//               <div className="w-24 h-12 bg-white rounded-t-lg flex justify-center items-center">
//                 <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
//                 <div className="w-6 h-6 bg-gray-300 rounded-full ml-2"></div>
//               </div>
//               <div className="w-24 h-12 bg-red-500 rounded-b-lg relative">
//                 <div className="absolute -left-1 top-0 w-2 h-12 bg-white"></div>
//                 <div className="absolute -right-1 top-0 w-2 h-12 bg-white"></div>
//               </div>
//             </div>

//             {/* Electricity Symbols */}
//             <div className="flex justify-between w-16 mt-2">
//               <div className="text-yellow-300 text-xl">⚡</div>
//               <div className="text-yellow-300 text-xl">⚡</div>
//             </div>
//           </div>

//           {/* Material */}
//           <div
//             className={`absolute w-16 h-16 ${materials[currentMaterial].color} rounded-md`}
//             style={{
//               transform: `translate(${materialPosition.x}px, ${materialPosition.y}px)`,
//               transition: "transform 1s ease-in-out",
//             }}
//           ></div>

//           {/* Particles Effect */}
//           {renderParticles()}

//           {/* Safety Goggles */}
//           <div className="absolute bottom-1/4 right-1/4">
//             <div className="w-12 h-6 bg-blue-200 rounded-full relative">
//               <div className="absolute left-2 right-2 top-1/2 h-1 bg-gray-400"></div>
//             </div>
//           </div>

//           {/* Material Selection */}
//           <div className="absolute top-4 right-4 flex gap-2">
//             <button
//               onClick={() => handleMaterialChange("iron")}
//               className={`p-2 rounded ${
//                 currentMaterial === "iron"
//                   ? "bg-gray-800 text-white"
//                   : "bg-gray-600 text-gray-200"
//               }`}
//             >
//               Iron
//             </button>
//             <button
//               onClick={() => handleMaterialChange("aluminum")}
//               className={`p-2 rounded ${
//                 currentMaterial === "aluminum"
//                   ? "bg-gray-800 text-white"
//                   : "bg-gray-400 text-gray-800"
//               }`}
//             >
//               Aluminum
//             </button>
//             <button
//               onClick={() => handleMaterialChange("glass")}
//               className={`p-2 rounded ${
//                 currentMaterial === "glass"
//                   ? "bg-blue-800 text-white"
//                   : "bg-blue-200 text-gray-800"
//               }`}
//             >
//               Glass
//             </button>
//           </div>

//           {/* Hands */}
//           <div className="absolute bottom-0 left-1/4 transform translate-x-1/2">
//             <div className="w-12 h-16 bg-pink-300 rounded-t-full flex gap-1 justify-center">
//               <div className="w-2 h-12 bg-pink-400 rounded-t-full"></div>
//               <div className="w-2 h-14 bg-pink-400 rounded-t-full"></div>
//               <div className="w-2 h-12 bg-pink-400 rounded-t-full"></div>
//               <div className="w-2 h-10 bg-pink-400 rounded-t-full"></div>
//             </div>
//           </div>

//           <div className="absolute bottom-0 right-1/4 transform -translate-x-1/2">
//             <div className="w-12 h-16 bg-pink-300 rounded-t-full flex gap-1 justify-center">
//               <div className="w-2 h-10 bg-pink-400 rounded-t-full"></div>
//               <div className="w-2 h-12 bg-pink-400 rounded-t-full"></div>
//               <div className="w-2 h-14 bg-pink-400 rounded-t-full"></div>
//               <div className="w-2 h-12 bg-pink-400 rounded-t-full"></div>
//             </div>
//           </div>

//           {/* Bins */}
//           {showBin && (
//             <>
//               <div className="absolute bottom-4 left-16 w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
//                 <Magnet size={24} className="text-white" />
//                 <div className="absolute -top-6 text-white text-xs font-bold">
//                   Magnetic
//                 </div>
//               </div>

//               <div className="absolute bottom-4 right-16 w-16 h-16 rounded-lg bg-gray-300 flex items-center justify-center">
//                 <Box size={24} className="text-gray-800" />
//                 <div className="absolute -top-6 text-white text-xs font-bold">
//                   Non-magnetic
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Right Panel - Controls & Results */}
//         <div className="w-64 flex flex-col gap-4">
//           <div className="bg-white rounded-lg shadow-lg p-4">
//             <h3 className="font-bold mb-4">Controls</h3>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">Strength</label>
//               <input
//                 type="range"
//                 min="10"
//                 max="100"
//                 value={magnetStrength}
//                 onChange={(e) => setMagnetStrength(parseInt(e.target.value))}
//                 className="w-full"
//               />
//               <div className="flex justify-between text-xs">
//                 <span>Weak</span>
//                 <span>{magnetStrength}%</span>
//                 <span>Strong</span>
//               </div>
//             </div>

//             <button
//               onClick={runTest}
//               disabled={testInProgress}
//               className={`w-full p-2 rounded text-white font-bold ${
//                 testInProgress
//                   ? "bg-gray-400"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {testInProgress ? "Testing..." : "Test"}
//             </button>

//             {showBin && (
//               <button
//                 onClick={resetTest}
//                 className="w-full p-2 mt-2 rounded text-white font-bold bg-blue-600 hover:bg-blue-700"
//               >
//                 Reset
//               </button>
//             )}
//           </div>
//           <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="p-4">
//               <h3 className="font-bold mb-2">Test Results</h3>

//               <div className="border rounded overflow-auto h-32">
//                 <table className="w-full text-xs">
//                   <thead className="bg-gray-100 sticky top-0">
//                     <tr>
//                       <th className="p-1 text-left">Material</th>
//                       <th className="p-1 text-right">Magnetic</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {testResults.map((result, idx) => (
//                       <tr key={idx} className="border-t">
//                         <td className="p-1">{result.materialName}</td>
//                         <td className="p-1 text-right">
//                           {result.isAttracted ? (
//                             <span className="text-green-600">Yes</span>
//                           ) : (
//                             <span className="text-red-600">No</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Bottom Panel */}
//     </div>
//   );
// };

// export default MagnetismExplorer;

{
  //
  /*
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm font-bold">Magnet Strength</div>
        <div className="w-full h-4 mt-1 bg-gray-600 rounded overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
            style={{ width: `${magnetStrength}%` }}
          />
        </div>
        <div className="text-center text-sm mt-1">{magnetStrength}%</div>
      </div>

      <button
        onClick={runTest}
        disabled={testInProgress}
        className={`ml-4 px-6 py-2 rounded text-white font-bold ${
          testInProgress ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Test
      </button>
    </div>;

    //
  /* Left Panel
        <div className="w-64 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-800 text-white p-2 font-bold">
            DESCRIPTION
          </div>

          <div className="p-4">
            <h3 className="font-bold">Magnetism Status</h3>
            <p className="text-sm mt-2 mb-4">
              Observe how materials react to magnetic forces based on their
              properties.
            </p>

            <div className="border-t pt-2">
              <div className="flex justify-between text-sm">
                <span>Material:</span>
                <span className="font-bold">
                  {materials[currentMaterial].name}
                </span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Magnet Strength:</span>
                <span className="font-bold">{magnetStrength}%</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Magnetic:</span>
                <span className="font-bold">
                  {materials[currentMaterial].isMagnetic ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs">
              <p>
                Magnetic materials contain unpaired electrons that align with
                external magnetic fields, creating attraction.
              </p>
            </div>
          </div>

          <div className="border-t">
            <button
              className="w-full p-2 bg-blue-100 hover:bg-blue-200 transition-colors text-sm font-bold"
              onClick={() => document.getElementById("table-tab").click()}
            >
              TABLE
            </button>

            <button
              className="w-full p-2 bg-blue-100 hover:bg-blue-200 transition-colors text-sm font-bold"
              onClick={() => document.getElementById("graph-tab").click()}
            >
              GRAPH
            </button>
          </div>
        </div>
        - Data */
}
