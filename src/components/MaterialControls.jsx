import React from "react";

const MaterialControls = ({
  magneticStrength,
  onChange,
  onTest,
  onReset,
  isTestActive,
}) => {
  return (
    <div className="w-full mb-6 p-4 bg-gray-100 rounded-lg">
      <label className="block mb-2 font-medium">
        Magnetic Strength: {magneticStrength}%
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={magneticStrength}
        onChange={onChange}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />

      <div className="flex mt-4 space-x-4">
        <button
          onClick={onTest}
          disabled={isTestActive}
          className={`px-4 py-2 rounded-lg font-medium ${
            isTestActive
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Test Magnetic Attraction
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
        >
          Reset Experiment
        </button>
      </div>
    </div>
  );
};

export default MaterialControls;
