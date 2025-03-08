import React, { createContext, useState } from "react";

// Create Context
export const ExperimentContext = createContext();

// Provider Component
export const ExperimentProvider = ({ children }) => {
  const [conductivityData, setConductivityData] = useState([]);
  const [MagnetisimData, setMagnetisimData] = useState([]);
  const [dissolvingData, setDissolvingData] = useState([]);

  return (
    <ExperimentContext.Provider
      value={{
        conductivityData,
        setConductivityData,
        MagnetisimData,
        setMagnetisimData,
        dissolvingData,
        setDissolvingData,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};
