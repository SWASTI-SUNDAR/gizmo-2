import React from "react";
import Magnet from "./Magnet";
import DraggableMaterial from "./DraggableMaterial";
import MaterialBin from "./MaterialBin";

const ExperimentArea = ({
  materials,
  materialsState,
  isTestActive,
  magneticStrength,
  onDrop,
}) => {
  return (
    <div className="relative w-full h-96 bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden">
      {/* Materials */}
      {materials.map((material) => (
        <DraggableMaterial
          key={material.id}
          material={material}
          isTestActive={isTestActive}
          position={materialsState[material.id].position}
          location={materialsState[material.id].location}
        />
      ))}

      {/* Magnet */}
      <Magnet strength={magneticStrength} />

      {/* Bins */}
      <MaterialBin
        type="magneticBin"
        title="Magnetic"
        className="right-24 top-32 bg-red-200 border-red-500"
        onDrop={(item) => onDrop(item.id, "magneticBin")}
      />

      <MaterialBin
        type="nonMagneticBin"
        title="Non-Magnetic"
        className="right-24 top-64 bg-blue-200 border-blue-500"
        onDrop={(item) => onDrop(item.id, "nonMagneticBin")}
      />

      {/* Instructions */}
      <div className="absolute left-2 top-2 text-xs bg-white bg-opacity-80 p-2 rounded">
        1. Adjust magnet strength
        <br />
        2. Test the attraction
        <br />
        3. Sort materials into correct bins
      </div>
    </div>
  );
};

export default ExperimentArea;
