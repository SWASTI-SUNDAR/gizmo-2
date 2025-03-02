import React, { useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { ExperimentContext } from "../context/Context";

const ExperimentCard = ({ title, color, children }) => (
  <Card className="bg-white rounded-lg shadow-md">
    <CardHeader>
      <div className={`h-1 ${color} rounded-t-lg mb-2`} />
      <CardTitle className="text-gray-700 text-lg font-medium">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ParameterRow = ({ label, value }) => (
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);
// useEffect(() => {
//   parent.SCORM_SetCompleted();
// }, []);

const ScienceSimulationUI = () => {
  const { gasesData, evaporationDataresult, dissolvingData } =
    useContext(ExperimentContext);
  alert("Result Page");
  console.log(gasesData, evaporationDataresult, dissolvingData);
  return (
    <div
      style={{ backgroundImage: "url(result-page-bg.png)" }}
      className="w-full bg-no-repeat bg-bottom bg-cover pt-24 h-screen"
    >
      <div className="max-w-6xl relative h-full mx-auto">
        <img
          src="labby.png"
          className="absolute hidden md:block -bottom-12 h-[50vh] right-[1%] animate-[girl_3s_ease-in-out_infinite] girl duration-300 "
          alt=""
        />
        <div>
          <h1 className="text-xl font-bold text-center text-gray-800 mb-8">
            Labby's Lab Report
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <ExperimentCard title="Invisible Gases" color="bg-pink-500">
              <ParameterRow
                label="Volume"
                value={gasesData[0]?.volume || "N/A"}
              />
              <ParameterRow
                label="Pressure"
                value={gasesData[0]?.pressure || "N/A"}
              />
              <ParameterRow
                label="Temperature"
                value={gasesData[0]?.temperature || "N/A"}
              />
            </ExperimentCard>
          </div>

          <div className="col-span-1">
            <ExperimentCard title="Evaporation Simulation" color="bg-cyan-500">
              <ParameterRow
                label="Evaporation Rate"
                value={evaporationDataresult[0]?.evaporationRate || "N/A"}
              />
              <ParameterRow
                label="Temperature"
                value={evaporationDataresult[0]?.temperature || "N/A" + " °C"}
              />
              <ParameterRow
                label="Time"
                value={evaporationDataresult[0]?.timestamp || "N/A" + " °C"}
              />
            </ExperimentCard>
          </div>

          <div className="col-span-1">
            <ExperimentCard
              title="Dissolving a Solid in Liquid"
              color="bg-orange-500"
            >
              <ParameterRow
                label="Concentration"
                value={dissolvingData[0]?.concentration || "N/A"}
              />
              <ParameterRow
                label="Temperature"
                value={dissolvingData[0]?.temperature || "N/A" + " °C"}
              />
              <ParameterRow
                label="Stirring Speed"
                value={dissolvingData[0]?.stirringSpeed || "N/A" + " °C"}
              />
            </ExperimentCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScienceSimulationUI;
