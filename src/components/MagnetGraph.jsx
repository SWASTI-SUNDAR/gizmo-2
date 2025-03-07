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
    <div className="bg-white ">
      <h2 className="text-lg font-medium mb-2 text-center">
        Magnet Strength vs Distance
      </h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={graphData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="distance"
            label={{
              value: "Distance (pixels)",
              position: "insideBottom",
              offset: -5,
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
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MagnetGraph;
