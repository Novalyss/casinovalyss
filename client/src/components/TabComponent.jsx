import { useState } from "react";

export default function TabComponent({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Container des onglets + contenu en colonne */}
      <div className="flex flex-col">

        {/* Headers des onglets : chaque onglet prend la même largeur */}
        <div className="flex w-full border-b">
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={`cursor-pointer select-none flex-1 text-center px-3 py-2 transition rounded-t-lg
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

        {/* Contenu : prend toute la largeur, n'agrandit pas le parent.
            On limite la largeur max interne et on permet le scroll si nécessaire */}
        <div className="w-full">
          <div className="p-4 w-full max-w-full overflow-x-auto">
            <div className="p-4 w-full max-w-full flex flex-col">
              {tabs[activeTab].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}