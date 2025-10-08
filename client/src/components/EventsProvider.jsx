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
  const [questProgress, setQuestProgress] = useState({});
  const [casinoStats, setCasinoStats] = useState({});

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
      console.log("Classe du joueur mise à jour:", e.data);
      setClasse(e.data);
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

    eventSource.onerror = (err) => {
      console.error("Erreur SSE:", err);
      return;
    };

    return () => eventSource.close();
  }, []);

  return (
    <EventsContext.Provider value={{ gold, shop, inventory, equipment, classe, level, questProgress, casinoStats }}>
      {<Outlet />}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}