import React, { useContext } from "react";
import ResultPage from "../components/ResultPage";
import { ExperimentContext } from "../context/Context";

function Result() {
  const { conductivityData, MagnetisimData, dissolvingData } =
    useContext(ExperimentContext);

  const recordedData = {
    conductivity: conductivityData,
    Magnetisim: MagnetisimData,
    dissolving: dissolvingData,
  };

  return (
    <div>
      <ResultPage recordedData={recordedData} />
    </div>
  );
}

export default Result;

