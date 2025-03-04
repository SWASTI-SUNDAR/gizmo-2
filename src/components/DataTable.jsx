import React from "react";

const DataTable = ({ materials, testResults }) => {
  return (
    <div className="w-full mt-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-2">Material Properties Data</h2>
      <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Material</th>
            <th className="py-2 px-4 border-b text-center">
              Magnetic Property
            </th>
            <th className="py-2 px-4 border-b text-center">Test Result</th>
            <th className="py-2 px-4 border-b text-center">Attraction Force</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${material.color} mr-2`}
                  ></div>
                  {material.name}
                </div>
              </td>
              <td className="py-2 px-4 border-b text-center">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                  ${
                    material.isMagnetic
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {material.isMagnetic ? "Magnetic" : "Non-magnetic"}
                </span>
              </td>
              <td className="py-2 px-4 border-b text-center">
                {testResults && testResults[material.id] ? (
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                    ${
                      testResults[material.id].attracted
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {testResults[material.id].attracted
                      ? "Attracted"
                      : "Not Attracted"}
                  </span>
                ) : (
                  <span className="text-gray-400">Not tested</span>
                )}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {testResults &&
                testResults[material.id] &&
                testResults[material.id].attracted ? (
                  <span className="font-mono">
                    {testResults[material.id].force.toFixed(2)} N
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
