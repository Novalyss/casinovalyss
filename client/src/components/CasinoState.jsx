import { useEvents } from "./EventsProvider";

export default function CasinoState() {
    const { online } = useEvents();

    return (
        <div className="text-center text-lg font-semibold">
            {online === "on" ? (
          <span>le casino est ouvert !</span>
        ) : (
          <span>le casino est fermé !</span>
        )}
        </div>
    );
}