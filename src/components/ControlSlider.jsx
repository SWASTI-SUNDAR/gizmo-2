import React from "react";

export const ControlSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  toFixed,
}) => {
  const displayValue = toFixed ? value.toFixed(toFixed) : value;

  return (
    <div className="flex md:flex-col gap-3 items-center">
      <label className="text-blue-400 text-sm font-semibold">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-red-500"
      />
      <span className="text-sm">
        {displayValue} {unit}
      </span>
    </div>
  );
};
