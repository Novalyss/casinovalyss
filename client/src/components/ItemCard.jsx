import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEvents } from "./EventsProvider";

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

  const { equipment } = useEvents();

  function countTotalStats(itemSelected) {
    const totalStats =
      itemSelected.Chance +
      itemSelected.FlatBonus +
      itemSelected.MultBonus +
      itemSelected.CooldownReduction +
      itemSelected.CostReduction;

      return totalStats;
  }

  function getBorderClass(itemSelected) {
    const thresholds = [
      { limit: 100, color: "border-gray-400" },
      { limit: 200, color: "border-green-500" },
      { limit: 300, color: "border-blue-500" },
      { limit: 400, color: "border-purple-500" },
      { limit: 500, color: "border-yellow-500" },
      { limit: Infinity, color: "border-red-500" },
    ];

    const totalStats = countTotalStats(itemSelected);

    return thresholds.find((t) => totalStats < t.limit)?.color || "border-gray-300";
  }

  // 🔍 Trouver l'objet actuellement équipé du même type
  const equippedItem = equipment?.[item.Type];

  // 🔢 Fonction utilitaire pour comparer deux valeurs
  const compareStat = (stat) => {
    if (!equippedItem) return { value: item[stat], diff: null, color: "text-green-600" };
    const diff = item[stat] - equippedItem[stat];
    if (diff > 0) return { value: item[stat], diff: `+${diff}`, color: "text-green-600" };
    if (diff < 0) return { value: item[stat], diff: `${diff}`, color: "text-red-600" };
    return { value: item[stat], diff: "=", color: "text-gray-500" };
  };

  const stats = [
    { label: "Score de Chance", key: "Chance" },
    { label: "Score de Potatos Bonus", key: "FlatBonus" },
    { label: "Score de Multiplicateur", key: "MultBonus" },
    { label: "Score de Cooldown", key: "CooldownReduction" },
    { label: "Score de Réduction Coût", key: "CostReduction" },
  ];

  return (
    <div
      key={item.Id}
      className={`relative cursor-pointer border-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center overflow-hidden ${getBorderClass(item)}`}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer rounded-lg shadow-md">
              <img
                src={itemImages[item.Type]}
                alt={item.Type}
                className="w-10 h-10 sm:w-16 sm:h-16 object-cover"
              />
            </span>
          </TooltipTrigger>

          {/* Un seul TooltipContent pour contenir les deux comparaisons */}
          <TooltipContent
            side="top"
            className="!p-0 rounded text-sm"
            style={{ margin: 0 }}
          >
            <div className="flex gap-[1px]">
              {/* Tooltip principal */}
              <div className={`p-2 rounded border-4 ${getBorderClass(item)}`} >
                <div className="flex justify-between items-start">
                  <p>
                    <strong>Type: </strong>
                    {typeTranslations[item.Type] || item.Type}
                  </p>
                  <span className="text-xs font-bold px-0.5 py-0.5 rounded ml-auto self-start">
                    ilvl {countTotalStats(item)}
                  </span>
                </div>

                {stats.map(({ label, key }) => {
                  const { diff, color } = compareStat(key);
                  return (
                    <p key={key}>
                      <strong>{label}: </strong>
                      {item != equippedItem ?
                        <span className={color}>
                          {item[key]} {diff && `(${diff})`}
                        </span> : 
                        item[key]
                      }
                    </p>
                  );
                })}
              </div>

              {/* Tooltip comparaison */}
              {equippedItem && item !== equippedItem && (
                <div
                  className={`p-2 rounded border-4 ${getBorderClass(equippedItem)}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold mb-1">Actuellement équipé</p>
                    <span className="text-xs font-bold px-0.5 py-0.5 rounded ml-auto self-start">
                      ilvl {countTotalStats(equippedItem)}
                    </span>
                  </div>

                  {stats.map(({ label, key }) => (
                    <p key={key}>
                      <strong>{label}:</strong> {equippedItem[key]}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}