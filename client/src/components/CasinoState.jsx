import { useEvents } from "./EventsProvider";

export default function CasinoState() {
    const { online } = useEvents();

    return (
        <div
          className={`text-center text-lg font-semibold p-2 rounded ${
            online === "off" ? "bg-red-500 text-white" : ""
          }`}
        >
          {online === "off" && "Le casino est fermé !"}
        </div>
    );
}