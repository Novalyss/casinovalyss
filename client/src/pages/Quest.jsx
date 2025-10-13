import { useState, useEffect } from "react";
import { useEvents } from "../components/EventsProvider";
import { apiRequest } from "../lib/api";

export default function Quests() {
const [quests, setQuests] = useState({ daily: {}, weekly: {} });
const { questProgress } = useEvents();

  useEffect(() => {
    apiRequest("/progress");
    (async () => {
      const result = await apiRequest("/quests");
      const parsed = JSON.parse(result.result);
      setQuests(parsed);
    })();
  }, []);

const renderPlayerQuests = (allQuests, playerProgress, type) =>
    Object.entries(playerProgress).map(([id, current]) => {
      const quest = allQuests[id];
      if (!quest) return null; // sécurité si id inexistant

      const max = quest.Count;

      return (
        <div
          key={id}
          className={`bg-white border-2 rounded-lg p-1 shadow space-y-2 ${
            current >= max ? "border-green-400 bg-green-50" : "border-gray-300"
          }`}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{quest.Titre}</h3>
            <span className="text-sm text-gray-600">
              {current}/{max}
            </span>
          </div>
          <p className="text-gray-700 text-sm">{quest.Desc}</p>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full ${
                current >= max ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min((current / max) * 100, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            {/* Expérience */}
            <span className="text-yellow-600 font-semibold">
              {type === "Daily" ? "+5 Exp" : "+10 Exp"} 🟢
            </span>
            {/* Récompense */}
            <span className="text-yellow-600 font-semibold">
              {quest.Reward} 💰
            </span>
          </div>
        </div>
      );
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 p-4 text-center">📜 Quêtes</h1>
      <div className="mt-6 border-t pt-4"/>
      {/* Quêtes quotidiennes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          📅 Quêtes quotidiennes
        </h2>
        <div className="space-y-1">
          {Object.keys(questProgress.daily || {}).length > 0
            ? renderPlayerQuests(quests.daily, questProgress.daily, "Daily")
            : (
              <p className="text-gray-500 text-sm">
                Aucune quête quotidienne active.
              </p>
            )}
        </div>
      </div>

      {/* Quêtes hebdomadaires */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          📆 Quêtes hebdomadaires
        </h2>
        <div className="space-y-1">
          {Object.keys(questProgress.weekly || {}).length > 0
            ? renderPlayerQuests(quests.weekly, questProgress.weekly, "Weekly")
            : (
              <p className="text-gray-500 text-sm">
                Aucune quête hebdomadaire active.
              </p>
            )}
        </div>
      </div>
    </div>
  );
}