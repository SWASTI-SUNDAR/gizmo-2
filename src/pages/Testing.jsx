import React, { useState, useEffect, useRef } from 'react';

const MagnetSimulation = () => {
  // State for magnetic strength (0-100)
  const [magneticStrength, setMagneticStrength] = useState(0);
  const [testingActive, setTestingActive] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(null);
  const [draggingPos, setDraggingPos] = useState({ x: 0, y: 0 });
  const [showError, setShowError] = useState(false);
  
  // Track which materials are in bins
  const [materialStatus, setMaterialStatus] = useState({
    iron: 'normal',      // normal, inMagneticBin, inNonMagneticBin
    aluminum: 'normal',
    glass: 'normal'
  });

  // Refs for elements
  const containerRef = useRef(null);
  const magnetRef = useRef(null);

  // Materials and their properties
  const materials = [
    { id: 'iron', name: 'Iron', isMagnetic: true, attractionRate: 1.0, color: 'bg-gray-500' },
    { id: 'aluminum', name: 'Aluminum', isMagnetic: false, attractionRate: 0, color: 'bg-gray-300' },
    { id: 'glass', name: 'Glass', isMagnetic: false, attractionRate: 0, color: 'bg-blue-200' }
  ];

  // State for material positions
  const [materialsPos, setMaterialsPos] = useState({
    iron: { x: 80, y: 150 },
    aluminum: { x: 80, y: 220 },
    glass: { x: 80, y: 290 }
  });
  
  // Original positions for reset
  const originalPositions = {
    iron: { x: 80, y: 150 },
    aluminum: { x: 80, y: 220 },
    glass: { x: 80, y: 290 }
  };
  
  // Bin positions
  const magneticBin = { x: 500, y: 130, width: 60, height: 80 };
  const nonMagneticBin = { x: 500, y: 280, width: 60, height: 80 };

  // Handle slider change
  const handleSliderChange = (e) => {
    setMagneticStrength(parseInt(e.target.value));
  };

  // Handle test button click
  const handleTestClick = () => {
    if (Object.values(materialStatus).some(status => status !== 'normal')) {
      setMessage('Please reset the experiment first to test again.');
      return;
    }
    
    setTestingActive(true);
    setMessage('Testing magnetic attraction...');
    
    setTimeout(() => {
      setTestingActive(false);
      setMessage('Test complete! Now sort the materials into the correct bins.');
    }, 3000);
  };

  // Animation effect for magnetic materials when testing
  useEffect(() => {
    if (!testingActive) return;

    const magnetPos = {
      x: 350,
      y: 220
    };
    
    const interval = setInterval(() => {
      setMaterialsPos(prev => {
        const newPos = { ...prev };
        
        materials.forEach(material => {
          // Only animate materials that aren't in bins
          if (material.isMagnetic && materialStatus[material.id] === 'normal') {
            // Calculate how much to move based on magnetic strength and attraction rate
            const moveRate = (magneticStrength / 100) * material.attractionRate;
            
            // Calculate direction toward magnet
            const dx = magnetPos.x - prev[material.id].x;
            const dy = magnetPos.y - prev[material.id].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 30) { // Keep a minimum distance from magnet
              // Move toward magnet
              newPos[material.id] = {
                x: prev[material.id].x + (dx / distance) * moveRate * 5,
                y: prev[material.id].y + (dy / distance) * moveRate * 5
              };
              
              // Add shaking effect
              if (moveRate > 0.3) {
                newPos[material.id].x += (Math.random() - 0.5) * moveRate * 6;
                newPos[material.id].y += (Math.random() - 0.5) * moveRate * 6;
              }
            }
          }
        });
        
        return newPos;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [testingActive, magneticStrength, materialStatus]);

  // Handle drag start
  const handleDragStart = (materialId, e) => {
    if (testingActive) return;
    
    // Can't drag materials already in bins
    if (materialStatus[materialId] !== 'normal') return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsDragging(materialId);
      setDraggingPos({ x, y });
    }
  };

  // Handle drag move
  const handleMouseMove = (e) => {
    if (!isDragging || testingActive) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setDraggingPos({ x, y });
    }
  };

  // Handle drag end/drop
  const handleMouseUp = () => {
    if (!isDragging || testingActive) return;
    
    // Check if material is dropped in a bin
    const material = materials.find(m => m.id === isDragging);
    
    const isInMagneticBin = 
      draggingPos.x > magneticBin.x && 
      draggingPos.x < magneticBin.x + magneticBin.width &&
      draggingPos.y > magneticBin.y && 
      draggingPos.y < magneticBin.y + magneticBin.height;
      
    const isInNonMagneticBin = 
      draggingPos.x > nonMagneticBin.x && 
      draggingPos.x < nonMagneticBin.x + nonMagneticBin.width &&
      draggingPos.y > nonMagneticBin.y && 
      draggingPos.y < nonMagneticBin.y + nonMagneticBin.height;
    
    if (isInMagneticBin && material.isMagnetic) {
      // Correctly placed magnetic material
      setMessage('Correct! ' + material.name + ' is magnetic.');
      // Place material visibly in the magnetic bin
      setMaterialsPos(prev => ({
        ...prev,
        [isDragging]: { 
          x: magneticBin.x + magneticBin.width/2 - 20, 
          y: magneticBin.y + magneticBin.height/2 - 20
        }
      }));
      // Update material status
      setMaterialStatus(prev => ({
        ...prev,
        [isDragging]: 'inMagneticBin'
      }));
    } else if (isInNonMagneticBin && !material.isMagnetic) {
      // Correctly placed non-magnetic material
      setMessage('Correct! ' + material.name + ' is not magnetic.');
      // Place material visibly in the non-magnetic bin
      setMaterialsPos(prev => ({
        ...prev,
        [isDragging]: { 
          x: nonMagneticBin.x + nonMagneticBin.width/2 - 20, 
          y: nonMagneticBin.y + nonMagneticBin.height/2 - 20
        }
      }));
      // Update material status
      setMaterialStatus(prev => ({
        ...prev,
        [isDragging]: 'inNonMagneticBin'
      }));
    } else if (isInMagneticBin && !material.isMagnetic) {
      // Wrongly placed non-magnetic material in magnetic bin
      showErrorMessage('Error: ' + material.name + ' is not magnetic and cannot go in the magnetic bin!');
      resetMaterialPosition();
    } else if (isInNonMagneticBin && material.isMagnetic) {
      // Wrongly placed magnetic material in non-magnetic bin
      showErrorMessage('Error: ' + material.name + ' is magnetic and cannot go in the non-magnetic bin!');
      resetMaterialPosition();
    } else {
      // Not dropped in any bin
      resetMaterialPosition();
    }
    
    setIsDragging(null);
  };
  
  // Reset material to original position
  const resetMaterialPosition = () => {
    if (!isDragging) return;
    
    setMaterialsPos(prev => ({
      ...prev,
      [isDragging]: originalPositions[isDragging]
    }));
  };
  
  // Show error message temporarily
  const showErrorMessage = (msg) => {
    setMessage(msg);
    setShowError(true);
    
    setTimeout(() => {
      setShowError(false);
      setMessage('Try again. Sort each material into the correct bin.');
    }, 2000);
  };
  
  // Check if all materials are sorted correctly
  useEffect(() => {
    const allSorted = materials.every(material => {
      if (material.isMagnetic) {
        return materialStatus[material.id] === 'inMagneticBin';
      } else {
        return materialStatus[material.id] === 'inNonMagneticBin';
      }
    });
    
    if (allSorted && Object.values(materialStatus).every(status => status !== 'normal')) {
      setMessage('Excellent! Youve successfully sorted all materials. Click Reset to try again.');
    }
  }, [materialStatus]);
  
  // Reset the experiment
  const handleReset = () => {
    setMagneticStrength(0);
    setTestingActive(false);
    setMessage('Adjust the magnetic strength and test the materials');
    setIsDragging(null);
    setShowError(false);
    setMaterialsPos({ ...originalPositions });
    setMaterialStatus({
      iron: 'normal',
      aluminum: 'normal',
      glass: 'normal'
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Magnetic Properties Experiment</h1>
      
      {/* Controls */}
      <div className="w-full mb-6 p-4 bg-gray-100 rounded-lg">
        <label className="block mb-2 font-medium">
          Magnetic Strength: {magneticStrength}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={magneticStrength}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        
        <div className="flex mt-4 space-x-4">
          <button
            onClick={handleTestClick}
            disabled={testingActive}
            className={`px-4 py-2 rounded-lg font-medium ${
              testingActive ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Test Magnetic Attraction
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
          >
            Reset Experiment
          </button>
        </div>
      </div>
      
      {/* Message area */}
      <div className={`w-full mb-4 p-3 rounded-lg text-center font-medium ${
        showError ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {message || 'Adjust the magnetic strength and test the materials'}
      </div>
      
      {/* Experiment area */}
      <div 
        ref={containerRef}
        className="relative w-full h-96 bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Materials */}
        {materials.map(material => (
          <div
            key={material.id}
            className={`absolute w-16 h-16 rounded-lg ${material.color} flex items-center justify-center 
              ${materialStatus[material.id] === 'normal' ? 'cursor-grab' : 'cursor-default'} 
              shadow-md ${testingActive && material.isMagnetic ? 'animate-pulse' : ''} 
              ${isDragging === material.id ? 'z-50 cursor-grabbing' : 'z-10'}
              ${materialStatus[material.id] !== 'normal' ? 'ring-2 ring-green-500' : ''}
            `}
            style={{
              left: isDragging === material.id ? draggingPos.x - 32 : materialsPos[material.id].x,
              top: isDragging === material.id ? draggingPos.y - 32 : materialsPos[material.id].y,
              transition: isDragging === material.id || testingActive ? 'none' : 'all 0.5s ease'
            }}
            onMouseDown={(e) => handleDragStart(material.id, e)}
          >
            <span className="font-bold text-sm">{material.name}</span>
          </div>
        ))}
        
        {/* Magnet */}
        <div 
          ref={magnetRef}
          className={`absolute w-24 h-16 left-[350px] top-[220px] flex flex-col items-center justify-center ${
            magneticStrength > 0 ? 'bg-red-500' : 'bg-red-300'
          }`}
          style={{
            clipPath: 'polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)',
            transition: 'background-color 0.3s'
          }}
        >
          <div className="absolute left-0 top-0 h-full w-3/5 bg-gray-800"></div>
          <div className="absolute left-[60%] top-[10%] h-[80%] w-[20%] bg-white"></div>
          <div className={`absolute left-1 top-1/4 h-1/2 w-1/5 bg-white text-xs flex items-center justify-center font-bold ${
            magneticStrength > 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {magneticStrength > 60 ? 'N' : 'n'}
          </div>
        </div>
        
        {/* Bins */}
        <div className={`absolute w-16 h-20 right-24 top-32 bg-red-200 border-2 border-red-500 rounded flex flex-col items-center justify-center ${
          isDragging && materials.find(m => m.id === isDragging).isMagnetic ? 'bg-red-200 border-red-500 ring-4 ring-red-300' : 'bg-red-200 border-red-500'
        }`}>
          <div className="absolute top-0 w-full text-center text-xs font-bold">
            Magnetic
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full opacity-20"></div>
        </div>
        
        <div className={`absolute w-16 h-20 right-24 top-64 bg-blue-200 border-2 border-blue-500 rounded flex flex-col items-center justify-center ${
          isDragging && !materials.find(m => m.id === isDragging).isMagnetic ? 'bg-blue-200 border-blue-500 ring-4 ring-blue-300' : 'bg-blue-200 border-blue-500'
        }`}>
          <div className="absolute top-0 w-full text-center text-xs font-bold">
            Non-Magnetic
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full opacity-20"></div>
        </div>
        
        {/* Instructions */}
        <div className="absolute left-2 top-2 text-xs bg-white bg-opacity-80 p-2 rounded">
          1. Adjust magnet strength<br/>
          2. Test the attraction<br/>
          3. Sort materials into correct bins
        </div>
      </div>
    </div>
  );
};

export default MagnetSimulation;