import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function deserializeItem(str) {
  const [Id, Type, Chance, FlatBonus, MultBonus, CooldownReduction, CostReduction, Cost] = str.split("|");

  return {
    Id,
    Type,
    Chance: Number(Chance),
    FlatBonus: Number(FlatBonus),
    MultBonus: Number(MultBonus),
    CooldownReduction: Number(CooldownReduction),
    CostReduction: Number(CostReduction),
    Cost: Number(Cost)
  };
}