import React from "react";
import { ControlSlider } from "./ControlSlider";

export const SimulationControls = ({
  stirringSpeed,
  temperature,
  isSugar,
  onStirringSpeedChange,
  onTemperatureChange,
  onSugarToggle,
  onRecordDataPoint,
  onClearData,
}) => {
  return (
    <div className="bg-gray-900 w-full z-50 text-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-around md:gap-10 gap-5">
      <ControlSlider
        label="Stirring Speed"
        value={stirringSpeed}
        onChange={onStirringSpeedChange}
        min={0}
        max={10}
        step={0.1}
        unit="×"
        toFixed={1}
      />

      <ControlSlider
        label="Temperature (°C)"
        value={temperature}
        onChange={onTemperatureChange}
        min={0}
        max={100}
        step={1}
        unit="°C"
      />

      <div className="flex md:flex-col gap-3 items-center">
        <label className="text-blue-400 text-sm font-semibold">
          Sugar / Salt
        </label>
        <button
          onClick={onSugarToggle}
          className={`w-10 h-5 rounded-full relative transition-all ${
            isSugar ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
              isSugar ? "left-6" : "left-1"
            }`}
          />
        </button>
        <span className="text-sm">{isSugar ? "Sugar" : "Salt"}</span>
      </div>

      <div className="flex gap-5 items-center">
        <button
          onClick={onRecordDataPoint}
          className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-sm transition-colors"
        >
          Record Data Point
        </button>
        <button
          onClick={onClearData}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-sm transition-colors"
        >
          Clear Data
        </button>
      </div>
    </div>
  );
};
