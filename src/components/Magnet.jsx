import React from "react";

const Magnet = ({ strength }) => {
  return (
    <div
      className={`absolute w-24 h-16 left-[350px] top-[220px] flex flex-col items-center justify-center ${
        strength > 0 ? "bg-red-500" : "bg-red-300"
      }`}
      style={{
        clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
        transition: "background-color 0.3s",
      }}
    >
      <div className="absolute left-0 top-0 h-full w-3/5 bg-gray-800"></div>
      <div className="absolute left-[60%] top-[10%] h-[80%] w-[20%] bg-white"></div>
      <div
        className={`absolute left-1 top-1/4 h-1/2 w-1/5 bg-white text-xs flex items-center justify-center font-bold ${
          strength > 0 ? "text-red-500" : "text-gray-500"
        }`}
      >
        {strength > 60 ? "N" : "n"}
      </div>
    </div>
  );
};

export default Magnet;
