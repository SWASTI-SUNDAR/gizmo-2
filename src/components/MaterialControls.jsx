import React from "react";

const MaterialControls = ({
  magneticStrength,
  onChange,
  onTest,
  onReset,
  isTestActive,
}) => {
  return (
    <div className="space-y-6 absolute md:bottom-5 bottom-5 flex justify-center items-center w-full">
      <div className="bg-gray-900 w-full z-50 text-white p-3 rounded-lg shadow-lg grid grid-cols-3 justify-center items-center md:gap-10 gap-5">
        {/* Magnetic Strength Slider */}
        <div className="flex flex-col w-full gap-2 justify-center items-center">
          <span className="text-blue-400 text-sm font-semibold">
            Magnetic Strength
          </span>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={magneticStrength}
              onChange={onChange}
              className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          <span className="text-sm ml-2 w-12">{magneticStrength}%</span>
        </div>

        {/* Test and Reset Buttons */}
        <div className="flex gap-5 items-center justify-center w-full">
          <button
            onClick={onTest}
            disabled={isTestActive}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
              isTestActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Test Magnetic Attraction
          </button>
          <button
            onClick={onReset}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reset Experiment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialControls;
