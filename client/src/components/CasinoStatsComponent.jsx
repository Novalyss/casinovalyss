import { useEvents } from "./EventsProvider";
import { useEffect } from "react";
import { apiRequest } from "../lib/api";

export default function CasinoStats({ casinoStats: casinoStatsProp, }) {
    const { casinoStats: casinoStatsSSE } = useEvents();

    const casinoStats = casinoStatsProp ?? casinoStatsSSE;
    
    useEffect(() => {
        apiRequest("/casinostats");
    },[]);

    if (!casinoStats) return <p className="text-center">Chargement des stats...</p>;

    // --- Calculs ---
    const totalWins =
        casinoStats.WinT1Count +
        casinoStats.WinT2Count +
        casinoStats.WinT3Count +
        casinoStats.WinJackpotCount +
        casinoStats.WinEventCount;

    const totalGames = totalWins + casinoStats.LoseCount;

    const winRate =
        totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;

    const rendement =
        casinoStats.PotatoSpent > 0
        ? (((casinoStats.PotatoWon - casinoStats.PotatoSpent) / casinoStats.PotatoSpent) * 100).toFixed(0)
        : (casinoStats.PotatoWon > 0 ? 100 : 0)

    return (
        <div className="text-center text-lg font-semibold p-2 rounded">
            <div className="grid grid-cols-2 gap-4 bg-white shadow-md rounded-xl p-4">
                <Stat label="Défaites" value={casinoStats.LoseCount} />
                <Stat label="Victoires T1" value={casinoStats.WinT1Count} />
                <Stat label="Victoires T2" value={casinoStats.WinT2Count} />
                <Stat label="Victoires T3" value={casinoStats.WinT3Count} />
                <Stat label="Jackpots" value={casinoStats.WinJackpotCount} />
                <Stat label="Événements gagnés" value={casinoStats.WinEventCount} />
                <Stat label="🥔 Gagnés" value={casinoStats.PotatoWon} />
                <Stat label="🥔 Dépensés" value={casinoStats.PotatoSpent} />
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-lg font-semibold">🔢 Nombre de parties jouées : {totalGames}</p>
                <p className="text-lg font-semibold">🎯 Win Rate : {winRate}%</p>
                <p className="text-lg font-semibold">💹 Rendement : {rendement}%</p>
            </div>
        </div>
    );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-3 shadow-sm">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}