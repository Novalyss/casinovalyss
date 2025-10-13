import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const itemImages = {
  Helm: "../assets/stuff/Helm.png",
  Gloves: "../assets/stuff/Gloves.png",
  Chest: "../assets/stuff/Chest.png",
  Legs: "../assets/stuff/Legs.png",
  Boots: "../assets/stuff/Boots.png",
  Weapon: "../assets/stuff/Weapon.png"
};

export default function ItemCard({ item }) {

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
      className={`relative cursor-pointer border-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center overflow-hidden ${borderClass}`}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer rounded-lg shadow-md">
              <img src={itemImages[item.Type]} alt={item.Type} className="w-10 h-10 sm:w-16 sm:h-16 object-cover" />
            </span>
          </TooltipTrigger>
          <TooltipContent className={`text-sm border-4 ${borderClass}`} >
            <div>
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
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}