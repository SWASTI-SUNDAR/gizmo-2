import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const TabContent = ({ tab, activeTab, data }) => {
  if (!activeTab || activeTab !== tab) return null;

  if ((tab === "table" || tab === "graph") && (!data || data.length === 0)) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        No recorded data points yet. Click "Record Data Point" to add data!
      </div>
    );
  }

  switch (tab) {
    case "description":
      return <DescriptionTab />;
    case "table":
      return <DataTable data={data} />;
    case "graph":
      return <DataGraph data={data} />;
    default:
      return null;
  }
};

const DescriptionTab = () => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-2">
      Dissolving Solids: The Hidden World of Particles
    </h2>
    <p className="mb-2">
      Watch how solids dissolve as temperature and stirring speed change!
    </p>
    <p className="mt-2 text-gray-600">
      Click "Record Data Point" to capture the current concentration.
    </p>
  </div>
);


const DataTable = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg overflow-auto max-h-80">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Time (s)</th>
          <th className="px-4 py-2">Concentration (%)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{row.time}</td>
            <td className="border px-4 py-2">{row.concentration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DataGraph = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" label="Time (s)" />
        <YAxis
          label={{
            value: "Concentration (%)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="concentration"
          stroke="#8884d8"
          dot={true}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
