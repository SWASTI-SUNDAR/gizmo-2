import React, { useRef, useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import "chart.js/auto";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ExperimentContext } from "../context/Context";
import ZoomToggleSwitch from "../components/ZoomToggleSwitch";

const EvaporationEffect = ({ temperature }) => {
  const molecules = temperature > 50 ? temperature : temperature * 0.2;
  return (
    <group>
      {[...Array(Math.floor(molecules / 2))].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full w-3 h-3"
          animate={{ z: [0, 50], opacity: [1, 0] }}
          transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </group>
  );
};

export default function EvaporationSimulation() {
  const [temperature, setTemperature] = useState(25);
  const [isZoomed, setIsZoomed] = useState(false);
  const [evaporationData, setEvaporationData] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  const { evaporationDataresult, setEvaporationDataResult } =
    useContext(ExperimentContext);

  const recordData = () => {
    const newData = {
      timestamp: new Date().toLocaleTimeString(),
      temperature: temperature,
      evaporationRate: (temperature * 0.5).toFixed(2),
    };
    setEvaporationData((prev) => [...prev, newData]);
    setEvaporationDataResult([...evaporationDataresult, newData]);
  };
  const renderTabContent = (tab) => {
    if (!activeTab || activeTab !== tab) return null;
    if ((tab === "table" || tab === "graph") && evaporationData.length === 0) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          No recorded data to show. Record some data by clicking the "Record
          Data" button!
        </div>
      );
    }
    switch (tab) {
      case "description":
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">
              Evaporation: The Hidden World of Particles
            </h2>
            <p className="mb-2">
              Watch how water molecules behave as temperature changes!
            </p>
            <p>
              <strong>Temperature:</strong> {temperature}°C
            </p>
            <p className="mt-2 text-gray-600">
              As temperature increases, water molecules gain energy and
              evaporate faster.
            </p>
          </div>
        );
      case "table":
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg overflow-auto max-h-80">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-center py-2">Temperature (°C)</th>
                  <th className="text-center py-2">Evaporation Rate</th>
                </tr>
              </thead>
              <tbody>
                {evaporationData.map((data, index) => (
                  <tr key={index}>
                    <td className="border  text-center py-2">
                      {data.temperature}
                    </td>
                    <td className="border text-center py-2">
                      {data.evaporationRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "graph":
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evaporationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label="Time (s)" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff7300"
                  name="Temperature"
                />
                <Line
                  type="monotone"
                  dataKey="evaporationRate"
                  stroke="#387908"
                  name="Evaporation Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url(page-two-bg.png)" }}
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 h-full max-w-screen-2xl mx-auto">
        <div className="relative space-y-6 h-full mt-6">
          <div
            style={{
              backgroundImage: "url(glass-container.png)",
            }}
            className={`absolute bg-clip-padding overflow-hidden  
              items-center bg-cover bg-center bg-no-repeat md:right-1/2 
              ${
                isZoomed
                  ? "h-72 w-72 translate-x-1/2 top-1/3"
                  : "translate-x-1/2 h-64 w-64 top-1/3"
              }
               flex justify-center  rounded-full p-2 transition-all duration-300`}
          >
            <div
              className={`relative ${
                isZoomed ? "h-48 w-48" : " h-44 w-44 "
              }  flex items-center overflow-hidden rounded-full justify-center`}
            >
              <div className="">
                <EvaporationEffect temperature={temperature} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="md:absolute hidden md:block md:top-14 md:w-96 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
            {["description", "table", "graph"].map((tab) => (
              <div key={tab} className="border-b">
                <button
                  className="w-full text-left px-4 py-2 bg-blue-200 hover:bg-blue-300"
                  onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                >
                  {tab.toUpperCase()}
                </button>
                {renderTabContent(tab)}
              </div>
            ))}
          </div>

          <img
            src="char-hand.png"
            className="absolute hidden md:block bottom-0 h-[30vh] right-[30%] boy duration-300 "
            alt=""
          />
          {/* Bottom Controls */}
          <div className="absolute bottom-10 z-50 left-4 right-4 bg-gray-900 p-4 rounded-lg">
            <div className="flex space-x-4 justify-center text-white items-center gap-10">
              <div className="flex md:flex-col gap-3 items-center">
                <label className="text-white text-sm">
                  Temperature 
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="md:w-52 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <span className="text-sm">{temperature}°C ×</span>
              </div>
              <button
                onClick={recordData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Record Data
              </button>
              <ZoomToggleSwitch
                isZoomed={isZoomed}
                setIsZoomed={setIsZoomed}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
