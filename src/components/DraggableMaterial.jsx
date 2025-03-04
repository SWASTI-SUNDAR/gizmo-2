import React from "react";
import { useDrag } from "react-dnd";
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
      className={`absolute w-16 h-16 rounded-lg ${
        material.color
      } flex items-center justify-center 
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
      <span className="font-bold text-sm select-none pointer-events-none">
        {material.name}
      </span>
    </div>
  );
};

export default DraggableMaterial;
