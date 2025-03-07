import React, { createContext, useState } from "react";

// Create Context
export const ExperimentContext = createContext();

// Provider Component
export const ExperimentProvider = ({ children }) => {
  const [conductivity, setConductivity] = useState([]);
  const [evaporationDataresult, setEvaporationDataResult] = useState([]);
  const [dissolvingData, setDissolvingData] = useState([]);

  return (
    <ExperimentContext.Provider
      value={{
        conductivity,
        setConductivity,
        evaporationDataresult,
        setEvaporationDataResult,
        dissolvingData,
        setDissolvingData,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};
