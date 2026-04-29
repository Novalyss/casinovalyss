import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function deserializeItem(str) {
  const [Id, Type, Chance, FlatBonus, MultBonus, CooldownReduction, CostReduction, Cost, Name] = str.split("|");

  return {
    Id,
    Type,
    Chance: Number(Chance),
    FlatBonus: Number(FlatBonus),
    MultBonus: Number(MultBonus),
    CooldownReduction: Number(CooldownReduction),
    CostReduction: Number(CostReduction),
    Cost: Number(Cost),
    Name: Name
  };
}

export function countTotalStats(itemSelected) {
  return (
    itemSelected.Chance +
    itemSelected.FlatBonus +
    itemSelected.MultBonus +
    itemSelected.CooldownReduction +
    itemSelected.CostReduction
  );
}

export function getBorderClass(selectionItem) {
  const thresholds = [
    { limit: 100, color: "border-gray-400" },
    { limit: 200, color: "border-green-500" },
    { limit: 300, color: "border-blue-500" },
    { limit: 400, color: "border-purple-500" },
    { limit: 500, color: "border-yellow-500" },
    { limit: Infinity, color: "border-red-500" },
  ];

  const totalStats = countTotalStats(selectionItem);
  return thresholds.find((t) => totalStats < t.limit)?.color || "border-gray-400";
}

export function getItemColor(selectionItem) {
  const thresholds = [
    { limit: 100, color: "text-gray-400" },
    { limit: 200, color: "text-green-500" },
    { limit: 300, color: "text-blue-500" },
    { limit: 400, color: "text-purple-500" },
    { limit: 500, color: "text-yellow-500" },
    { limit: Infinity, color: "text-red-500" },
  ];

  const totalStats = countTotalStats(selectionItem);
  return thresholds.find((t) => totalStats < t.limit)?.color || "text-gray-400";
}