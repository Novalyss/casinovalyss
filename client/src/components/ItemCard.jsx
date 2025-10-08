import { useState } from "react";

const itemImages = {
  Helm: "../assets/stuff/Helm.png",
  Gloves: "../assets/stuff/Gloves.png",
  Chest: "../assets/stuff/Chest.png",
  Legs: "../assets/stuff/Legs.png",
  Boots: "../assets/stuff/Boots.png",
  Weapon: "../assets/stuff/Weapon.png"
};

export default function ItemCard({ item }) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  const thresholds = [
  { limit: 100, color: "border-gray-400" },
  { limit: 200, color: "border-green-500" },
  { limit: 300, color: "border-blue-500" },
  { limit: 400, color: "border-purple-500" },
  { limit: 500, color: "border-yellow-500" },
  { limit: Infinity, color: "border-red-500" },
];

const totalStats =
  item.Chance +
  item.FlatBonus +
  item.MultBonus +
  item.CooldownReduction +
  item.CostReduction;

const borderClass = thresholds.find((t) => totalStats < t.limit)?.color || "border-gray-300";

  return (
    <div
      key={item.Id}
      className={`relative cursor-pointer p-1 border-4 rounded-lg shadow bg-white hover:shadow-lg transition flex flex-col items-center ${borderClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      <img
        src={itemImages[item.Type]}
        alt={item.Type}
        className="w-16 h-16 object-contain"
      />

      {tooltip.visible && (
        <div
          className="fixed min-w-[150px] bg-white text-black text-sm p-2 rounded-lg shadow-lg border border-gray-300 z-50 pointer-events-none"
          style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
        >
          {/* Badge ilvl en haut à droite */}
          <div className="absolute top-1 right-1 text-xs font-bold px-1 rounded">
            ilvl {totalStats}
          </div>
          <p><strong>Type:</strong> {item.Type}</p>
          <p><strong>Score de chance:</strong> {item.Chance}</p>
          <p><strong>Score de Potatos Bonus:</strong> {item.FlatBonus}</p>
          <p><strong>Score de Multiplicateur de Potatos:</strong> {item.MultBonus}</p>
          <p><strong>Score de Réduction de Cooldown:</strong> {item.CooldownReduction}</p>
          <p><strong>Score de Réduction de Coût:</strong> {item.CostReduction}</p>
        </div>
      )}
    </div>
  );
}