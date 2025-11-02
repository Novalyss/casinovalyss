import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { deserializeItem } from "../lib/utils";

const EventsContext = createContext();



export function EventsProvider() {
  const [gold, setGold] = useState(0);
  const [shop, setShop] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [classe, setClasse] = useState(null);
  const [level, setLevel] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [titles, setTitles] = useState([]);
  const [questProgress, setQuestProgress] = useState({});
  const [casinoStats, setCasinoStats] = useState({});
  const [online, setOnline] = useState("off");
  const [refreshTimer, setRefreshTimer] = useState();
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("jwt");

    if (!token)
      return;

    const eventSource = new EventSource(`/api/events?token=${encodeURIComponent(token)}`);

     // handler par type
    eventSource.addEventListener("account", (e) => {
      console.log("Gold mis à jour:", e.data);
      setGold(e.data);
    });

    eventSource.addEventListener("class", (e) => {
      const data = JSON.parse(e.data);
      console.log("Classe du joueur mise à jour:", data);
      setClasse(data);
    });

    eventSource.addEventListener("casinostats", (e) => {
      const data = JSON.parse(e.data);
      console.log("Casino stats du joueur mise à jour:", data);
      setCasinoStats(data);
    });

    eventSource.addEventListener("level", (e) => {
      console.log("Niveau du joueur mise à jour:", e.data);
      setLevel(e.data);
    });

    eventSource.addEventListener("currentTitle", (e) => {
      const data = JSON.parse(e.data);
      console.log("Titre sélectionné du joueur mise à jour:", data);
      setCurrentTitle(data);
    });

    eventSource.addEventListener("titles", (e) => {
      const data = JSON.parse(e.data);
      console.log("Liste des titres du joueur mise à jour:", data);
      setTitles(data);
    });

    eventSource.addEventListener("progress", (e) => {
      const data = JSON.parse(e.data);
      console.log("Quêtes du joueur mise à jour:", data);
      setQuestProgress(data);
    });

    eventSource.addEventListener("shop", (e) => {
      const data = JSON.parse(e.data);
      let items = null;
      if (data) {
        items = data.map(deserializeItem);
      }
      console.log("Shop mis à jour:", items);
      setShop(items);
    });

    eventSource.addEventListener("inventory", (e) => {
      const data = JSON.parse(e.data);
      const items = data.map(deserializeItem);
      console.log("Inventaire mis à jour:", items);
      setInventory(items);
    });

    eventSource.addEventListener("equipment", (e) => {
      const data = JSON.parse(e.data);
      const items = data.map(deserializeItem);
      const dictionary = items.reduce((acc, item) => {
        acc[item.Type] = item;
        return acc;
      }, {});
      console.log("Equipment mis à jour:", dictionary);
      setEquipment(dictionary);
    });

    /* config */
    eventSource.addEventListener("live", (e) => {
      const status = JSON.parse(e.data);
      //const status = e.data;
      console.log("live updated", status);
      setOnline(status);
    });

    eventSource.addEventListener("refreshShopTimer", (e) => {
      const refreshDate = JSON.parse(e.data);
      //const refreshDate = e.data;
      console.log("refreshShopTimer", refreshDate);
      setRefreshTimer(refreshDate);
    });

    eventSource.addEventListener("leaderboard", (e) => {
      const payload = JSON.parse(e.data);
      //const payload = e.data;
      console.log(payload);

      if (payload.length > 1) {
        // Cas 1 : on reçoit tout le leaderboard
        // 🔥 On clone pour garantir un nouvel array
        setLeaderboardData([...payload]);
      } else if (payload.length === 1) {
        // Cas 2 : un seul user
        const updatedUser = payload[0];
        setLeaderboardData((prev) => {
          const exists = prev.find((u) => u.user === updatedUser.user);

          if (exists) {
            // retourne un nouveau tableau
            return prev.map((u) =>
              u.user === updatedUser.user ? { ...u, ...updatedUser } : u
            );
          } else {
            // ajout
            return [...prev, updatedUser];
          }
        });
      }
    });

    eventSource.onerror = (err) => {
      console.error("Erreur SSE:", err);
      return;
    };

    return () => eventSource.close();
  }, []);

  return (
    <EventsContext.Provider value={{ gold, shop, inventory, equipment, classe, level, currentTitle, titles, questProgress, casinoStats, online, leaderboardData, refreshTimer }}>
      {<Outlet />}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}