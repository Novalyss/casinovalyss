import { useEffect, useState } from "react";
import { apiRequest } from "../components/api";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const playerName = localStorage.getItem("userInfo");

  useEffect(() => {
    (async () => {
      const result = await apiRequest("/leaderboard");
      const data = JSON.parse(result.result);

      // Transforme l'objet en tableau [{ name, score }]
      const entries = Object.entries(data).map(([name, score]) => ({
        name,
        score,
      }));

      // Tri décroissant
      entries.sort((a, b) => b.score - a.score);

      setLeaderboard(entries);
    })();
  }, []);

  if (leaderboard.length === 0) {
    return <p className="text-center text-gray-500">Chargement du classement...</p>;
  }

  // Top 5
  const top5 = leaderboard.slice(0, 5);

  // Chercher la position du joueur connecté
  const playerIndex = leaderboard.findIndex((p) => p.name === playerName);
  const playerData =
    playerIndex !== -1 && playerIndex >= 5 ? leaderboard[playerIndex] : null;

  // Fonction pour afficher une médaille selon la position
  const getMedal = (idx) => {
    if (idx === 0) return "🥇";
    if (idx === 1) return "🥈";
    if (idx === 2) return "🥉";
    return null;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">🏆 Leaderboard</h1>

      {/* Top 5 */}
      <div className="space-y-3">
        {top5.map((player, idx) => (
          <div
            key={player.name}
            className={`flex justify-between items-center p-3 rounded-lg border-2 shadow ${
              player.name === playerName
                ? "bg-yellow-100 border-yellow-400 font-bold"
                : "bg-white border-gray-300"
            }`}
          >
            <span className="flex items-center gap-2">
              {getMedal(idx) && <span className="text-xl">{getMedal(idx)}</span>}
              <span>{idx + 1}. {player.name}</span>
            </span>
            <span className="font-semibold">{player.score}</span>
          </div>
        ))}
      </div>

      {/* Si le joueur n’est pas dans le top 5, on l’affiche en bas */}
      {playerData && (
        <div className="mt-6 border-t pt-4">
          <div
            className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 border-2 border-yellow-400 font-bold shadow"
          >
            <span>
              {playerIndex + 1}. {playerData.name}
            </span>
            <span className="font-semibold">{playerData.score}</span>
          </div>
        </div>
      )}
    </div>
  );
}