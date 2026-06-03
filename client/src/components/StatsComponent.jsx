import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function StatsComponent({equipment, equipmentConfig}) {

  if (!equipment || !equipmentConfig) {
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
  const MAX_STATS_PER_ITEM = 300;

  return (
    <div className="p-4 sm:p-4 text-left rounded-lg max-w-full overflow-x-hidden">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h2 className="text-xl font-bold mb-4">📊 Statistiques</h2>
          </TooltipTrigger>
          <TooltipContent>
            Statistiques donné par l'équipement
          </TooltipContent>
        </Tooltip>
        <ul className="space-y-2">
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm sm:text-base cursor-pointer">
                  🍀 Chance : +{Math.floor(totals.Chance / (MAX_STATS_PER_ITEM * 6) * equipmentConfig.Chance)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Augmente les chances de gagner le gacha</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm sm:text-base cursor-pointer">
                  🎁 Bonus : +{Math.floor(totals.FlatBonus / (MAX_STATS_PER_ITEM * 6) * equipmentConfig.Flat)} potatos
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Potatos ajouté aux gains de base d'un gagné gagné</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm sm:text-base cursor-pointer">
                  📈 Multiplicateur Bonus : +{((totals.MultBonus / (MAX_STATS_PER_ITEM * 6) * equipmentConfig.Mult) * 100).toFixed(2)}%
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Multiplicateur final de potatos</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm sm:text-base cursor-pointer">
                  ⏱️ Réduction de cooldown : -{Math.floor(totals.CooldownReduction / (MAX_STATS_PER_ITEM * 6) * equipmentConfig.CDR)} secondes
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Réduit le temps minimum entre 2 lancés de gacha</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm sm:text-base cursor-pointer">
                  💰 Réduction de coût : -{Math.floor(totals.CostReduction / (MAX_STATS_PER_ITEM * 6) * equipmentConfig.CostR)} potatos
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Réduit le coût nécessaire pour lancer un gacha</p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>
      </TooltipProvider>
    </div>
  );
}