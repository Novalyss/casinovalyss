import { useEffect } from 'react';
import { useEvents } from "./EventsProvider";
import { apiRequest } from "../lib/api";

export default function ShopComponent() {
    const { gold } = useEvents();

    useEffect(() => {
        apiRequest("/account");
    }, []);

    if (!gold) {
        return <div className="text-lg font-semibold">Chargement ...</div>;
    }

    return (
    <p className="text-sm sm:text-base md:text-lg font-semibold flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        💰 <span>Mes potatos :</span>
        <span className="font-bold text-yellow-600">{gold}</span>
    </p>
    );
}