import { useEvents } from "./EventsProvider";

export default function StatsComponent({data}) {
  const { equipment } = useEvents();

  if (!equipment) {
    return <div className="text-center p-4">⏳ Chargement...</div>;
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
      <ul className="space-y-2">
        <li>🍀 Chance : +{Math.floor(totals.Chance / data.Chance)}</li>
        <li>🎁 Bonus : +{Math.floor(totals.FlatBonus / data.Flat)} potatos</li>
        <li>📈 Multiplicateur Bonus : +{totals.MultBonus / data.Mult * 100}%</li>
        <li>⏱️ Réduction de cooldown : -{Math.floor(totals.CooldownReduction / data.CDR)} secondes</li>
        <li>💰 Réduction de coût : -{totals.CostReduction * data.CostR} potatos</li>
      </ul>
    </div>
  );
}