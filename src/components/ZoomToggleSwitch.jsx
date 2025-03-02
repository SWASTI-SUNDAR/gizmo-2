import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";

const ZoomToggleSwitch = ({ isZoomed, setIsZoomed }) => {
  return (
    <div className="flex flex-row-reverse gap-3 items-center">
      <label className="flex items-center cursor-pointer relative">
        <input
          type="checkbox"
          checked={isZoomed}
          onChange={() => setIsZoomed(!isZoomed)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-gray-500 rounded-full peer-checked:bg-blue-500 relative">
          <div
            className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${
              isZoomed ? "left-6" : "left-1"
            }`}
          />
        </div>
      </label>
      <span className="flex items-center gap-1 text-sm overflow-hidden relative w-24">
        <div
          className={`flex items-center gap-1 transition-transform duration-300 ${
            isZoomed ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <Maximize2 className="w-4 h-4" />
          Zoom In
        </div>
        <div
          className={`flex items-center gap-1 absolute top-0 transition-transform duration-300 ${
            isZoomed ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Minimize2 className="w-4 h-4" />
          Zoom Out
        </div>
      </span>
    </div>
  );
};

export default ZoomToggleSwitch;
