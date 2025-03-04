import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/dndTypes";

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
      className={`absolute w-16 h-20 border-2 rounded flex flex-col items-center justify-center 
      ${className} ${isOver ? "ring-4 ring-opacity-50" : ""}`}
    >
      <div className="absolute top-0 w-full text-center text-xs font-bold">
        {title}
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-full opacity-20"></div>
    </div>
  );
};

export default MaterialBin;
