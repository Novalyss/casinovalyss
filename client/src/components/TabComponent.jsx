import { useState } from "react";

export default function TabComponent({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Onglets */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-t-lg flex items-center justify-center 
                        transition cursor-pointer font-semibold text-sm sm:text-base 
                        ${
                          activeTab === index
                            ? "bg-blue-400 text-white"
                            : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                        }`}
          >
            {tab.title}
          </div>
        ))}
      </div>

      {/* Contenu actif */}
      <div className="p-2 sm:p-4 md:p-6 bg-white rounded-b-lg shadow-inner">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}