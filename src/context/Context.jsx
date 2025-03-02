import React, { createContext, useState } from "react";

// Create Context
export const ExperimentContext = createContext();

// Provider Component
export const ExperimentProvider = ({ children }) => {
  const [gasesData, setGasesData] = useState([]);
  const [evaporationDataresult, setEvaporationDataResult] = useState([]);
  const [dissolvingData, setDissolvingData] = useState([]);

  return (
    <ExperimentContext.Provider
      value={{
        gasesData,
        setGasesData,
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
