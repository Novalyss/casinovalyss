import { useEvents } from "./EventsProvider";
import { countTotalStats } from "../lib/utils";
import { getBorderClass } from "../lib/utils";
import { getItemColor } from "../lib/utils";


export default function ItemDetails({ item }) {
  const { equipment } = useEvents();

  // 🔍 Trouver l'objet actuellement équipé du même type
  const equippedItem = equipment?.[item.Type];

  const stats = [
    { label: "Score de Chance", key: "Chance" },
    { label: "Score de Potatos Bonus", key: "FlatBonus" },
    { label: "Score de Multiplicateur", key: "MultBonus" },
    { label: "Score de Cooldown", key: "CooldownReduction" },
    { label: "Score de Réduction Coût", key: "CostReduction" },
  ];

  const compareStat = (stat) => {
    if (!equippedItem) return { diff: null, color: "text-green-600" };
    const diff = item[stat] - equippedItem[stat];
    if (diff > 0) return { diff: `+${diff}`, color: "text-green-600" };
    if (diff < 0) return { diff: `${diff}`, color: "text-red-600" };
    return { diff: "=", color: "text-gray-500" };
  };

  return (
    
    <div className="flex justify-center flex-col sm:flex-row gap-[1px] text-left">
      {/* Item */}
      <div className={`relative p-2 pr-10 rounded border-4 ${getBorderClass(item)}`}>
        <p className={getItemColor(item)}>
          <strong>{item.Name}</strong>
        </p>

        <span className="absolute top-1 right-1 text-xs px-1.5 py-0.5 bg-black/70 text-white rounded">
          {countTotalStats(item)}
        </span>

        {stats.map(({ label, key }) => {
          const { diff, color } = compareStat(key);
          return (
            <p key={key} className="whitespace-nowrap">
              <strong>{label}: </strong>
              <span className={color}>
                {item[key]} {diff && `(${diff})`}
              </span>
            </p>
          );
        })}
      </div>

      {/* Comparaison */}
      {equippedItem && item !== equippedItem && (
        <div className={`relative p-2 pr-10 rounded border-4 ${getBorderClass(equippedItem)}`}>
          <p className="font-semibold">Équipé</p>

          <span className="absolute top-1 right-1 text-xs px-1.5 py-0.5 bg-black/70 text-white rounded">
            {countTotalStats(equippedItem)}
          </span>

          {stats.map(({ label, key }) => (
            <p key={key}>
              <strong>{label}: </strong> {equippedItem[key]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}