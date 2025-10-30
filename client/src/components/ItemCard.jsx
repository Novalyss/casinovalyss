import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const itemImages = {
  Helm: "../assets/stuff/Helm.png",
  Gloves: "../assets/stuff/Gloves.png",
  Chest: "../assets/stuff/Chest.png",
  Legs: "../assets/stuff/Legs.png",
  Boots: "../assets/stuff/Boots.png",
  Weapon: "../assets/stuff/Weapon.png"
};

const typeTranslations = {
  Helm: "Casque",
  Chest: "Plastron",
  Legs: "Jambières",
  Boots: "Bottes",
  Gloves: "Gants",
  Weapon: "Arme",
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
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <p><strong>Type:</strong> {typeTranslations[item.Type] || item.Type}</p>
                <span className="text-xs font-bold px-0.5 py-0.5 rounded ml-auto self-start">
                  ilvl {totalStats}
                </span>
              </div>
              <p><strong>Score de Chance:</strong> {item.Chance}</p>
              <p><strong>Score de Potatos Bonus:</strong> {item.FlatBonus}</p>
              <p><strong>Score de Multiplicateur:</strong> {item.MultBonus}</p>
              <p><strong>Score de Cooldown:</strong> {item.CooldownReduction}</p>
              <p><strong>Score de Réduction Coût:</strong> {item.CostReduction}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}