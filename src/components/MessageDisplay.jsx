import React from "react";

const MessageDisplay = ({ message, isError }) => {
  return (
    <div
      className={`w-full mb-4 p-3 rounded-lg text-center font-medium ${
        isError ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
      }`}
    >
      {message}
    </div>
  );
};

export default MessageDisplay;
