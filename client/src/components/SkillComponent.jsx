import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SkillComponent({ classe, level, classesConfig }) {

    // fonction qui calcule le skill en fonction de la classe
  const getSkillDescription = () => {
    switch (classe) {
      case "Leprechaun":
        const chance = Math.floor(level / classesConfig.LeprechaunLevelDivider);
        return `🍀 Chance accrue : ta chance est augmenter de ${chance}.`;
      case "Pirate":
        const mult = level / classesConfig.LevelCap * classesConfig.PirateBaseMultiplier + 1;
        return `🏴‍☠️ Butin des mers : ton multiplicateur de bonus actuel est de x${mult}.`;
      case "Voleur":
        let bonus = classesConfig.VoleurMinPayment + (level / classesConfig.LevelCap) * (classesConfig.VoleurMaxPayment - classesConfig.VoleurMinPayment);
        bonus = Math.floor(bonus * classesConfig.CasinoMult);
        return `🦹 Larcin : chaque victoire te rapporte ${bonus} potatos de plus.`;
      case "Magicien":
        const procChance = Math.floor(level / classesConfig.MagicienLevelDivider);
        return `🎲 Coup de maître : tu as ${procChance}% de chances d’obtenir un tirage supplémentaire.`;
      case "Enchanteur":
        const nbEnchantGameRequired = Math.floor(classesConfig.EnchantMaxGame - (level / classesConfig.LevelCap) * (classesConfig.EnchantMaxGame - classesConfig.EnchantMinGame));
        const enchantChanceValue = Math.floor(level / classesConfig.EnchantLevelDivider);
        return `⭐ Main de la fortune : toutes les ${nbEnchantGameRequired} parties, ton prochain tirage peut être !enchanter, augmentant ta chance de +${enchantChanceValue}.`;
      case "Ouvrier":
        const nbOuvrierGameRequired = Math.floor(classesConfig.OuvrierMaxGame - (level / classesConfig.LevelCap) * (classesConfig.OuvrierMaxGame - classesConfig.OuvrierMinGame));
        let ouvrierPayment = classesConfig.OuvrierMinPayment + (level / classesConfig.LevelCap) * (classesConfig.OuvrierMaxPayment - classesConfig.OuvrierMinPayment);
        ouvrierPayment = Math.floor(ouvrierPayment * classesConfig.CasinoMult);
        return `⚒️ Ouvrier assidu : toutes les ${nbOuvrierGameRequired} barres de fer déplacées, tu es payé ${ouvrierPayment} potatos.`;
      case "Pyromancien":
        let pyromancienThreshold = classesConfig.PyromancienMinThreshold + (level / classesConfig.LevelCap) * (classesConfig.PyromancienMaxThreshold - classesConfig.PyromancienMinThreshold);
        pyromancienThreshold = Math.floor(pyromancienThreshold * classesConfig.CasinoMult);
        let pyromancienBonus = classesConfig.PyromancienMinBonus + (level / classesConfig.LevelCap) * (classesConfig.PyromancienMaxBonus - classesConfig.PyromancienMinBonus);
		    pyromancienBonus = Math.floor(pyromancienBonus * classesConfig.CasinoMult);
        return `🔥 Pyromancien téméraire : si ton montant de potatos est en dessous de ${pyromancienThreshold}, tu gagnes +${pyromancienBonus} de chance.`;
      case "Brigand":
        const brigandRequiredGame = Math.floor(classesConfig.BrigandMaxGame - (level / classesConfig.LevelCap) * (classesConfig.BrigandMaxGame - classesConfig.BrigandMinGame));
        return `🕶️ Vol à la tire : toutes les ${brigandRequiredGame} parties jouées, tu peux !voler le casino.`;
      default:
        return "💤 Sans talent : aucune capacité spéciale… utilise !changerClasse pour en obtenir une.";
    }
  };

  return (
    <div className="p-4 rounded-lg">
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="text-xl font-bold mb-2">✨ Compétence spéciale</h2>
            </TooltipTrigger>
            <TooltipContent>
              Compétence unique de la classe
            </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p>{getSkillDescription()}</p>
    </div>
  );
}