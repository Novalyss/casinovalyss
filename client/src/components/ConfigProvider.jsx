import React, { createContext, useContext, useEffect, useState } from "react";

const EventsContext = createContext();

export function OnlineProvider({ children }) {
  const [online, setOnline] = useState("off");
  const [refreshTimer, setRefreshTimer] = useState();
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/config");

    eventSource.addEventListener("live", (e) => {
      console.log(e.data);
      const status = JSON.parse(e.data);
      console.log("live updated", status);
      setOnline(status);
    });

    eventSource.addEventListener("refreshShopTimer", (e) => {
      console.log(e.data);
      const refreshDate = JSON.parse(e.data);
      console.log("refreshShopTimer", refreshDate);
      setRefreshTimer(refreshDate);
    });

    eventSource.addEventListener("leaderboard", (e) => {
      const payload = JSON.parse(e.data); // toujours un tableau

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

    // Nettoyage à la fermeture
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <EventsContext.Provider value={{ online, leaderboardData, refreshTimer }}>
      {children}
    </EventsContext.Provider>
  );
}

// Hook pour consommer facilement le contexte
export function useConfig() {
  return useContext(EventsContext);
}