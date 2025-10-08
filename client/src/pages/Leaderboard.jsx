import { useMemo } from "react";
import { useConfig } from "../components/ConfigProvider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Leaderboard() {
  const { leaderboardData } = useConfig();
  const playerName = localStorage.getItem("userInfo");

  const leaderboard = useMemo(() => {
    console.log("update");
    return leaderboardData
      .map(({ user, MiniGames = 0, DailyQuests = 0, WeeklyQuests = 0 }) => {
        const score = WeeklyQuests * 10 + DailyQuests * 5 + MiniGames;
        return { user, score, MiniGames, DailyQuests, WeeklyQuests };
      })
      .sort((a, b) => b.score - a.score);
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">🏆 Leaderboard</h1>

      <TooltipProvider>
      <div className="space-y-3">
        {top.map((player, idx) => (
          <div
            key={player.user}
            className={`flex justify-between items-center p-3 rounded-lg border-2 shadow ${
              player.user === playerName
                ? "bg-yellow-100 border-yellow-400 font-bold"
                : "bg-white border-gray-300"
            }`}
          >
              <span className="flex items-center gap-2">
                {getMedal(idx) ? (
                  <span className="text-xl">{getMedal(idx)} {player.user}</span>
                ) : (
                  <span>{idx + 1}. {player.user}</span>
                )}
              </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-semibold">{player.score}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quêtes hebdo: {player.WeeklyQuests}, Quêtes quotidienne: {player.DailyQuests}, Mini Jeux:{player.MiniGames}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>

      {/* Si le joueur n’est pas dans le top, on l’affiche en bas */}
      {playerData && (
        <div className="mt-6 border-t pt-4">
          <div
            className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 border-2 border-yellow-400 font-bold shadow"
          >
            <span>
              {playerIndex + 1}. {playerData.user}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-semibold">{playerData.score}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quêtes hebdo: {playerData.WeeklyQuests}, Quêtes quotidienne: {playerData.DailyQuests}, Mini Jeux:{playerData.MiniGames}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </TooltipProvider>
    </div>
  );
}