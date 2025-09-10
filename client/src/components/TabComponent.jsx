import { useState } from "react";

export default function TabComponent({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Onglets */}
      <div className="flex justify-center gap-2 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`p-2 rounded-t-lg flex items-center justify-center transition ${
              activeTab === index
                ? "!bg-[#3fb6e0]"
                : ""
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Contenu actif */}
      <div className="p-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}