import React, { useState, useEffect, useRef } from "react";
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
import * as THREE from "three";

// Material definitions with properties
const MATERIALS = [
  {
    id: "iron",
    name: "Iron",
    isMagnetic: true,
    color: "#a19d94",
    attractionFactor: 0.9,
    particleColor: 0xa19d94,
  },
  {
    id: "aluminum",
    name: "Aluminum",
    isMagnetic: false,
    color: "#d6d6d6",
    attractionFactor: 0,
    particleColor: 0xd6d6d6,
  },
  {
    id: "glass",
    name: "Glass",
    isMagnetic: false,
    color: "#add8e6",
    attractionFactor: 0,
    particleColor: 0xadd8e6,
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

  // References for Three.js
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const animationFrameRef = useRef(null);
  const magnetPositionRef = useRef({ x: -1.5, y: 0, z: 0 });
  const binPositionsRef = useRef({
    magnetic: { x: -2, y: -1.5, z: 0 },
    nonmagnetic: { x: 2, y: -1.5, z: 0 },
  });

  // Initial Three.js setup
  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Changed to transparent background
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable transparency
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Add magnet
    const magnetGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.2);
    const magnetMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.7,
      roughness: 0.3,
    });
    const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
    magnet.position.set(
      magnetPositionRef.current.x,
      magnetPositionRef.current.y,
      magnetPositionRef.current.z
    );
    scene.add(magnet);

    // Add magnetic bin
    const magneticBinGeometry = new THREE.BoxGeometry(1, 0.8, 0.2);
    const magneticBinMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5555,
      transparent: true,
      opacity: 0.7,
    });
    const magneticBin = new THREE.Mesh(
      magneticBinGeometry,
      magneticBinMaterial
    );
    magneticBin.position.set(
      binPositionsRef.current.magnetic.x,
      binPositionsRef.current.magnetic.y,
      binPositionsRef.current.magnetic.z
    );
    scene.add(magneticBin);

    // Add magnetic bin text
    const magneticTextMesh = createTextMesh(
      "Magnetic",
      0xff0000,
      -2.3,
      -1.2,
      0.1
    );
    scene.add(magneticTextMesh);

    // Add non-magnetic bin
    const nonMagneticBinGeometry = new THREE.BoxGeometry(1, 0.8, 0.2);
    const nonMagneticBinMaterial = new THREE.MeshStandardMaterial({
      color: 0x5555ff,
      transparent: true,
      opacity: 0.7,
    });
    const nonMagneticBin = new THREE.Mesh(
      nonMagneticBinGeometry,
      nonMagneticBinMaterial
    );
    nonMagneticBin.position.set(
      binPositionsRef.current.nonmagnetic.x,
      binPositionsRef.current.nonmagnetic.y,
      binPositionsRef.current.nonmagnetic.z
    );
    scene.add(nonMagneticBin);

    // Add non-magnetic bin text
    const nonMagneticTextMesh = createTextMesh(
      "Non-Magnetic",
      0x0000ff,
      1.6,
      -1.2,
      0.1
    );
    scene.add(nonMagneticTextMesh);

    // Create particles for the selected material
    createParticles();

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle container resize
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Helper function to create text meshes
  const createTextMesh = (text, color, x, y, z) => {
    // Since we can't use actual text in Three.js without a font loader,
    // we'll create a simple placeholder for the label
    const labelGeometry = new THREE.PlaneGeometry(0.8, 0.2);
    const labelMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
    });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.position.set(x, y, z);
    return labelMesh;
  };

  // Create particles based on selected material
  const createParticles = () => {
    // Remove existing particles if any
    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
    }

    // Create new particle system
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Initialize particle positions randomly within a sphere
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 3;
      positions[i3 + 1] = (Math.random() - 0.5) * 3;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.5;

      // Random initial velocities
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: selectedMaterial.particleColor,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    particlesRef.current = particles;
  };

  // Update particles when material changes
  useEffect(() => {
    if (sceneRef.current) {
      createParticles();
    }
  }, [selectedMaterial]);

  // Movement and attraction logic for particles
  useEffect(() => {
    if (!particlesRef.current || !testInProgress) return;

    const updateParticles = () => {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const velocities =
        particlesRef.current.geometry.attributes.velocity.array;
      const particleCount = positions.length / 3;
      const attractionDirection = selectedMaterial.isMagnetic ? -1 : 0; // Negative for attraction
      const magnetPosition = magnetPositionRef.current;
      const attractionStrength =
        (magnetStrength / 100) * selectedMaterial.attractionFactor * 0.01;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Get current position
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Calculate distance to magnet
        const dx = x - magnetPosition.x;
        const dy = y - magnetPosition.y;
        const dz = z - magnetPosition.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Apply attraction force (inverse square law)
        if (distance > 0.1) {
          const force = attractionStrength / (distance * distance);
          velocities[i3] += attractionDirection * dx * force;
          velocities[i3 + 1] += attractionDirection * dy * force;
          velocities[i3 + 2] += attractionDirection * dz * force;
        }

        // Update position with velocity
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Add some damping to prevent perpetual motion
        velocities[i3] *= 0.98;
        velocities[i3 + 1] *= 0.98;
        velocities[i3 + 2] *= 0.98;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.velocity.needsUpdate = true;
    };

    const interval = setInterval(updateParticles, 16); // ~60fps

    return () => clearInterval(interval);
  }, [testInProgress, magnetStrength, selectedMaterial]);

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
    }, 5000); // Longer test duration to see particle movement
  };

  // Handle particle movement to bins when classified
  const classifyMaterial = (bin) => {
    const correct =
      (bin === "magnetic" && selectedMaterial.isMagnetic) ||
      (bin === "nonmagnetic" && !selectedMaterial.isMagnetic);

    // Move particles toward the selected bin
    const targetBin =
      bin === "magnetic"
        ? binPositionsRef.current.magnetic
        : binPositionsRef.current.nonmagnetic;

    const moveParticlesToBin = () => {
      if (!particlesRef.current) return;

      const positions = particlesRef.current.geometry.attributes.position.array;
      const velocities =
        particlesRef.current.geometry.attributes.velocity.array;
      const particleCount = positions.length / 3;

      let allParticlesInBin = true;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Get current position
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Calculate direction to bin
        const dx = x - targetBin.x;
        const dy = y - targetBin.y;
        const dz = z - targetBin.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance > 0.2) {
          allParticlesInBin = false;

          // Apply force toward bin
          const force = 0.005;
          velocities[i3] -= dx * force;
          velocities[i3 + 1] -= dy * force;
          velocities[i3 + 2] -= dz * force;

          // Update position with velocity
          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];

          // Add some damping
          velocities[i3] *= 0.98;
          velocities[i3 + 1] *= 0.98;
          velocities[i3 + 2] *= 0.98;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.velocity.needsUpdate = true;

      if (!allParticlesInBin) {
        requestAnimationFrame(moveParticlesToBin);
      } else {
        setTimeout(() => {
          setTestInProgress(false);
          // Reset particles
          createParticles();

          // Show classification result
          alert(
            `Classification ${correct ? "CORRECT!" : "INCORRECT!"} ${
              selectedMaterial.name
            } is ${selectedMaterial.isMagnetic ? "magnetic" : "non-magnetic"}.`
          );
        }, 500);
      }
    };

    moveParticlesToBin();
  };

  return (
    <div
      className="w-full bg-no-repeat bg-center bg-cover h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('magnetisim/bg-image.png')",
      }}
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto p-6">
        <div className="relative space-y-6 h-full mt-6">
          <ControlPanel
            magnetStrength={magnetStrength}
            setMagnetStrength={setMagnetStrength}
            MATERIALS={MATERIALS}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            testInProgress={testInProgress}
            runTest={runTest}
          />
          {/* Three.js container with fixed height */}
          <div ref={mountRef} className="w-full h-64 relative z-0"></div>

          <div className="absolute bottom-28 flex gap-5 justify-center items-center w-full">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
              onClick={() => classifyMaterial("magnetic")}
              disabled={testInProgress}
            >
              Drop in Magnetic Bin
            </button>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
              onClick={() => classifyMaterial("nonmagnetic")}
              disabled={testInProgress}
            >
              Drop in Non-Magnetic Bin
            </button>
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
        <div className="flex flex-col gap-2 justify-center items-center">
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
              className=" h-1 w-full bg-gray-300 rounded-lg cursor-pointer accent-orange-500"
            />
          </div>
          <span className="text-sm ml-2 w-12">{magnetStrength}%</span>
        </div>

        {/* Test & Record Buttons */}
        <div className="flex gap-5 items-center  justify-center w-full">
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

// {
//   testInProgress && (
//     <div className="absolute top-4 right-4 bg-white/80 p-4 rounded-lg shadow-lg z-20">
//       <p className="font-semibold text-blue-800">
//         Testing {selectedMaterial.name}...
//       </p>
//       <p>
//         {selectedMaterial.isMagnetic
//           ? "Magnetic attraction detected!"
//           : "No magnetic attraction detected."}
//       </p>
//     </div>
//   );
// }