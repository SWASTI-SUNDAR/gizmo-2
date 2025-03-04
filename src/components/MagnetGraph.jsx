import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MagnetGraph = ({ graphData }) => {
  // If no data, show a placeholder
  if (!graphData || graphData.length === 0) {
    return (
      <div className="w-full mt-6 p-6 bg-gray-50 border rounded-lg flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-2">
          No magnetic attraction data available
        </p>
        <p className="text-sm text-gray-400">
          Run a test with higher magnetic strength to generate data
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-bold mb-2">Magnet Strength vs Distance</h2>
      <div className="bg-white shadow-sm rounded-lg p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={graphData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="distance"
              label={{
                value: "Distance (pixels)",
                position: "bottom",
                offset: 0,
              }}
            />
            <YAxis
              label={{
                value: "Attraction Force (N)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value) => [`${value.toFixed(2)} N`, "Force"]}
              labelFormatter={(value) => `Distance: ${value.toFixed(0)} px`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="force"
              name="Iron Attraction"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              isAnimationActive={true}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MagnetGraph;
