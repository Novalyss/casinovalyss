import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function StatsComponent({equipment, equipmentConfig}) {

  if (!equipment) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  // Initialisation des stats à 0
  const totals = {
    Chance: 0,
    FlatBonus: 0,
    MultBonus: 0,
    CooldownReduction: 0,
    CostReduction: 0,
  };

  // Additionner les stats de chaque équipement
  Object.values(equipment).forEach((item) => {
    if (!item) return; // emplacement vide
    totals.Chance += item.Chance || 0;
    totals.FlatBonus += item.FlatBonus || 0;
    totals.MultBonus += item.MultBonus || 0;
    totals.CooldownReduction += item.CooldownReduction || 0;
    totals.CostReduction += item.CostReduction || 0;
  });

  return (
    <div className="p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">📊 Statistiques</h2>
      <TooltipProvider>
        <ul className="space-y-2">
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer rounded-lg shadow-md">
                  🍀 Chance : +{Math.floor(totals.Chance / equipmentConfig.Chance)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Augmente les chances de gagner le gacha.</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer rounded-lg shadow-md">
                  🎁 Bonus : +{Math.floor(totals.FlatBonus / equipmentConfig.Flat)} potatos
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Potatos ajouté aux gains de base d'un gagné gagné.</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer rounded-lg shadow-md">
                  📈 Multiplicateur Bonus : +{(totals.MultBonus / equipmentConfig.Mult) * 100}%
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Multiplicateur final de potatos.</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer rounded-lg shadow-md">
                  ⏱️ Réduction de cooldown : -{Math.floor(totals.CooldownReduction / equipmentConfig.CDR)} secondes
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Réduit le temps minimum entre 2 lancés de gacha.</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer rounded-lg shadow-md">
                  💰 Réduction de coût : -{totals.CostReduction * equipmentConfig.CostR} potatos
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>👉 Réduit le coût nécessaire pour lancer un gacha.</p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>
      </TooltipProvider>
    </div>
  );
}