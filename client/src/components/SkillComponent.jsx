import { useEvents } from "./EventsProvider";

export default function SkillComponent({data}) {
    const { classe, level } = useEvents();

    // fonction qui calcule le skill en fonction de la classe
  const getSkillDescription = () => {
    switch (classe) {
      case "Leprechaun":
        const chance = Math.floor(level / data.LeprechaunLevelDivider);
        return `🍀 Chance accrue : ta chance est augmenter de ${chance}.`;
      case "Pirate":
        const mult = level / data.LevelCap * data.PirateBaseMultiplier + 1;
        return `🏴‍☠️ Butin des mers : ton multiplicateur de bonus actuel est de x${mult}.`;
      case "Voleur":
        let bonus = data.VoleurMinPayment + (level / data.LevelCap) * (data.VoleurMaxPayment - data.VoleurMinPayment);
        bonus = Math.floor(bonus * data.CasinoMult);
        return `🦹 Larcin : chaque victoire te rapporte ${bonus} potatos de plus.`;
      case "Magicien":
        const procChance = Math.floor(level / data.MagicienLevelDivider);
        return `🎲 Coup de maître : tu as ${procChance}% de chances d’obtenir un tirage supplémentaire.`;
      case "Enchanteur":
        const nbEnchantGameRequired = Math.floor(data.EnchantMaxGame - (level / data.LevelCap) * (data.EnchantMaxGame - data.EnchantMinGame));
        const enchantChanceValue = Math.floor(level / data.EnchantLevelDivider);
        return `⭐ Main de la fortune : toutes les ${nbEnchantGameRequired} parties, ton prochain tirage peut être !enchanter, augmentant ta chance de +${enchantChanceValue}.`;
      case "Ouvrier":
        const nbOuvrierGameRequired = Math.floor(data.OuvrierMaxGame - (level / data.LevelCap) * (data.OuvrierMaxGame - data.OuvrierMinGame));
        let ouvrierPayment = data.OuvrierMinPayment + (level / data.LevelCap) * (data.OuvrierMaxPayment - data.OuvrierMinPayment);
        ouvrierPayment = Math.floor(ouvrierPayment * data.CasinoMult);
        return `⚒️ Ouvrier assidu : toutes les ${nbOuvrierGameRequired} barres de fer déplacées, tu es payé ${ouvrierPayment} potatos.`;
      case "Pyromancien":
        let pyromancienThreshold = data.PyromancienMinThreshold + (level / data.LevelCap) * (data.PyromancienMaxThreshold - data.PyromancienMinThreshold);
        pyromancienThreshold = Math.floor(pyromancienThreshold * data.CasinoMult);
        let pyromancienBonus = data.PyromancienMinBonus + (level / data.LevelCap) * (data.PyromancienMaxBonus - data.PyromancienMinBonus);
		    pyromancienBonus = Math.floor(pyromancienBonus * data.CasinoMult);
        return `🔥 Pyromancien téméraire : si ton montant de potatos est en dessous de ${pyromancienThreshold}, tu gagnes +${pyromancienBonus} de chance.`;
      case "Brigand":
        const brigandRequiredGame = Math.floor(data.BrigandMaxGame - (level / data.LevelCap) * (data.BrigandMaxGame - data.BrigandMinGame));
        return `🕶️ Vol à la tire : toutes les ${brigandRequiredGame} parties jouées, tu peux !voler le casino.`;
      default:
        return "💤 Sans talent : aucune capacité spéciale… utilise !changerClasse pour en obtenir une.";
    }
  };

  return (
    <div className="p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">✨ Compétence spéciale</h2>
      <p>{getSkillDescription()}</p>
    </div>
  );
}