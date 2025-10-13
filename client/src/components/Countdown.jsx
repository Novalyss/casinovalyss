import { useState, useEffect, useRef } from "react";

/**
 * Countdown component
 * props:
 *  - refreshTimer: string (ISO), number (timestamp ms) ou Date
 *  - onFinish: optional callback when countdown finishes
 */
export default function Countdown({ refreshTimer }) {
  const [timeLeftString, setTimeLeftString] = useState("");
  const intervalRef = useRef(null);
  const finishedRef = useRef(false);

  // Parse la date en ms ; retourne null si invalide
  function parseToMs(value) {
    if (!value && value !== 0) return null;
    if (typeof value === "number") return value;
    if (value instanceof Date) return value.getTime();
    if (typeof value === "string") {
      let s = value.trim();

      // Normaliser les fractions de secondes trop longues (garder 3 digits max)
      // ex: .9098288 -> .909
      s = s.replace(/\.(\d{3})\d+/, (m, g1) => `.${g1}`);

      // Essayer le parsing standard
      const parsed = Date.parse(s);
      if (!isNaN(parsed)) return parsed;

      // Si ça échoue, essayer en supprimant la fraction complètement
      const removedFrac = s.replace(/\.\d+/, "");
      const parsed2 = Date.parse(removedFrac);
      if (!isNaN(parsed2)) return parsed2;

      // invalide
      return null;
    }

    return null;
  }

  useEffect(() => {
    // cleanup précédent
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    finishedRef.current = false;

    if (!refreshTimer || refreshTimer === "null") {
      setTimeLeftString("Au prochain live !");
      return;
    }

    const targetMs = parseToMs(refreshTimer);

    if (targetMs === null) {
      console.warn("Countdown: refreshTimer invalide:", refreshTimer);
      setTimeLeftString("Date invalide");
      return;
    }

    function formatTime(ms) {
      if (ms <= 0) return "00:00:00";
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const hh = String(hours).padStart(2, "0");
      const mm = String(minutes).padStart(2, "0");
      const ss = String(seconds).padStart(2, "0");

      if (days > 0) {
        return `${days}j ${hh}:${mm}:${ss}`;
      }
      return `${hh}:${mm}:${ss}`;
    }

    function tick() {
      const now = Date.now();
      const diff = targetMs - now;

      if (diff <= 0) {
        if (!finishedRef.current) {
          finishedRef.current = true;
          setTimeLeftString("Au prochain live !");
        }
        // clear interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      setTimeLeftString(formatTime(diff));
    }

    // tick immédiat + interval
    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshTimer]);

  return (
    <div className="flex flex-wrap items-center justify-center text-center text-base sm:text-lg md:text-xl font-semibold gap-x-2 gap-y-1">
      🕒 <span>Prochain refresh :</span>
      <span className="font-mono text-blue-600">{timeLeftString}</span>
    </div>
  );
}