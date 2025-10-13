import { useEffect } from 'react';
import { useEvents } from "../components/EventsProvider";
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
        <p className="text-lg font-semibold">💰 Mes potatos: {gold}
    </p>);
}