import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../components/EventsProvider";
import { deserializeItem } from "../lib/utils";

export default function Leaderboard() {
  const { leaderboardData } = useEvents();
  const playerName = localStorage.getItem("userInfo");

  const leaderboard = useMemo(() => {

    return leaderboardData
      .filter(({ user }) => user !== "Novalyss")
      .map(({ user, equipment = [] }) => {

        // Désérialiser chaque item du joueur
        const items = equipment.map(deserializeItem);

        // Calculer la somme totale des stats de tous ses items
        const totalStats = items.reduce(
          (acc, item) =>
            acc +
            (item.Chance || 0) +
            (item.FlatBonus || 0) +
            (item.MultBonus || 0) +
            (item.CooldownReduction || 0) +
            (item.CostReduction || 0),
          0
        );

        return { user, totalStats };
      })
      // Trier les joueurs par total de stats décroissant
      .sort((a, b) => b.totalStats - a.totalStats);
}, [leaderboardData]);

  if (leaderboard.length === 0) {
    return <p className="text-center text-gray-500">Chargement du classement...</p>;
  }

  // Top
  const nbTopPlayer = 10;
  const top = leaderboard.slice(0, nbTopPlayer);

  // Chercher la position du joueur connecté
  const playerIndex = leaderboard.findIndex((p) => p.user === playerName);
  const playerData =
    playerIndex !== -1 && playerIndex >= nbTopPlayer ? leaderboard[playerIndex] : null;

  // Fonction pour afficher une médaille selon la position
  const getMedal = (idx) => {
    if (idx === 0) return "🥇";
    if (idx === 1) return "🥈";
    if (idx === 2) return "🥉";
    return null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 p-4 text-center">🏆 Leaderboard</h1>
      <div className="mt-6 border-t pt-4"/>
      <div className="space-y-1">
        {top.map((player, idx) => (
          <div
            key={player.user}
            className={`grid grid-cols-3 items-center p-1 rounded-lg border-2 shadow text-center ${
              player.user === playerName
                ? "bg-yellow-100 border-yellow-400 font-bold"
                : "bg-white border-gray-300"
            }`}
          >
              {/* Colonne 1 : rang + nom */}
              <div className="flex items-center gap-2 justify-start">
                {getMedal(idx) ? (
                  <span className="text-xl">
                    {getMedal(idx)} {player.user}
                  </span>
                ) : (
                  <span>
                    {idx + 1}. {player.user}
                  </span>
                )}
              </div>

              {/* Colonne 2 : 🛡️ Armurerie (centrée) */}
              <div className="flex justify-center">
                {player.user !== playerName && (
                  <Link to={`/armory?user=${player.user}`}>
                    <span className="cursor-pointer">
                      🛡️ Armurerie
                    </span>
                  </Link>
                )}
              </div>
            
            {/* Colonne 3 : score + tooltip (aligné à droite) */}
            <div className="flex justify-end">
              <span className="font-semibold">{player.totalStats} iLvl</span>
            </div>
          </div>
        ))}
      </div>

      {/* Si le joueur n’est pas dans le top, on l’affiche en bas */}
      {playerData && (
        <div className="mt-6 border-t pt-4">
          <div
            className="flex justify-between items-center p-1 rounded-lg bg-yellow-50 border-2 border-yellow-400 font-bold shadow"
          >
            <span>
              {playerIndex + 1}. {playerData.user}
            </span>
            <div className="flex justify-end">
              <span className="font-semibold">{player.totalStats} iLvl</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}