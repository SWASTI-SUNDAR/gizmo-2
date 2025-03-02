import React from "react";

export const RenderTabContent = ({ activeTab, setActiveTab, evaporationData }) => {
  const tab = ["description", "table", "graph"];
  if (!activeTab || activeTab !== tab) return null;
  if ((tab === "table" || tab === "graph") && evaporationData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        No recorded data to show. Record some data by clicking the "Record Data"
        button!
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
            As temperature increases, water molecules gain energy and evaporate
            faster.
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
        <div className="bg-white p-4 rounded-lg shadow-lg max-h-80">
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
