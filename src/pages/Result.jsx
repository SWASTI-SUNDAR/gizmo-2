import React, { useContext } from "react";
import ResultPage from "../components/ResultPage";
import { ExperimentContext } from "../context/Context";

function Result() {
  const { gasesData, evaporationDataResult, dissolvingData } =
    useContext(ExperimentContext);

  const recordedData = {
    gases: gasesData,
    evaporation: evaporationDataResult,
    dissolving: dissolvingData,
  };

  return (
    <div>
      <ResultPage recordedData={recordedData} />
    </div>
  );
}

export default Result;

