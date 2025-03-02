import { TabContent } from "./TabContent";

export const SimulationTabs = ({ activeTab, setActiveTab, data }) => {
  const tabs = ["description", "table", "graph"];

  return (
    <div className="md:absolute hidden md:block md:top-14 md:w-96 bg-white p-2 md:p-4 rounded-lg shadow-lg space-y-2">
      {tabs.map((tab) => (
        <div key={tab} className="border-b">
          <button
            className="w-full text-left px-4 py-2 bg-blue-200 hover:bg-blue-300"
            onClick={() => setActiveTab(activeTab === tab ? null : tab)}
          >
            {tab.toUpperCase()}
          </button>
          <TabContent tab={tab} activeTab={activeTab} data={data} />
        </div>
      ))}
    </div>
  );
};
