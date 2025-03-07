import React from "react";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/dndTypes";

const DraggableMaterial = ({ material, isTestActive, position, location }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.MATERIAL,
      item: { id: material.id },
      canDrag: !isTestActive && location === "workspace",
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [material, isTestActive, location]
  );

  return (
    <div
      ref={drag}
      className={`absolute w-16 h-16 rounded-lg flex items-center justify-center 
        ${
          location === "workspace" && !isTestActive
            ? "cursor-grab"
            : "cursor-default"
        } 
        shadow-md ${
          isTestActive && material.isMagnetic && location === "workspace"
            ? "animate-pulse"
            : ""
        } 
        ${isDragging ? "z-50 opacity-90" : "z-10"}
        ${location !== "workspace" ? "ring-2 ring-green-500" : ""}
        transition-all duration-200`}
      style={{
        left: position.x,
        top: position.y,
        transition: isDragging || isTestActive ? "none" : "all 0.5s ease",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <img
        src={`/${material.name.toLowerCase()}.png`}
        alt={material.name}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

const MaterialBin = ({ type, title, className, onDrop }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.MATERIAL,
      drop: (item) => onDrop(item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  return (
    <div
      ref={drop}
      className={`absolute w-16 h-16 border-2 rounded flex flex-col items-center justify-center 
      ${className} ${isOver ? "ring-4 ring-opacity-50" : ""}`}
    >
      <div className="absolute -top-6 w-full text-center text-xs font-bold">
        {title}
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

const Magnet = ({ strength }) => {
  return (
    <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 flex flex-col items-center">
      <div className="mb-2">
        <img
          src="/magnet.png"
          alt="Magnet"
          className="w-24 h-16 object-contain"
        />
      </div>
      <div className="flex items-center">
        <span className="mr-2 text-xs">Strength:</span>
        <input
          type="range"
          min="0"
          max="10"
          value={strength}
          className="w-24"
        />
      </div>
    </div>
  );
};

const ExperimentArea = ({
  materials,
  materialsState,
  isTestActive,
  magneticStrength,
  onDrop,
}) => {
  return (
    <div className="relative w-full h-[500px] bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden">
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
        className="right-24 bottom-24 bg-red-200 border-red-500"
        onDrop={(item) => onDrop(item.id, "magneticBin")}
      />

      <MaterialBin
        type="nonMagneticBin"
        title="Non-Magnetic"
        className="right-48 bottom-24 bg-blue-200 border-blue-500"
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
