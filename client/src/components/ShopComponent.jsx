import { useEffect } from 'react';
import { useEvents } from "../components/EventsProvider";
import { apiRequest } from "../components/api";
import { useToast } from "../components/Toaster";
import ItemCard from "../components/ItemCard";
import ActionButton from "../components/ActionButton";


export default function ShopComponent() {
    const { shop } = useEvents();
    const { addToast } = useToast();

     useEffect(() => {
        apiRequest("/shop");
      }, []);

    async function buyItem(item) {
        await apiRequest("/buy", "POST", {itemId: item.Id}, (data) => {
            console.log("Callback refresh shop:", data);
            if (data.success == "KO") {
              addToast(JSON.parse(data.data), "error");
            } else if (data.success == "PENDING") {
              addToast(JSON.parse(data.data), "warning");
            }
        });
    };

    async function refreshShop() {
        await apiRequest("/refresh", "PUT", null, (data) => {
            console.log("Callback refresh shop:", data);
            if (data.success == "KO") {
              addToast(JSON.parse(data.data), "error");
            } else if (data.success == "PENDING") {
              addToast(JSON.parse(data.data), "warning");
            }
        });
    };

    if (!shop) {
        return <div className="text-center p-4">⏳ Chargement...</div>;
    }

    return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shop.map((item) => (
          <div key={item.Id} className="flex flex-col items-center">
            <ItemCard item={item} />
            <ActionButton
              onClick={async () => buyItem(item)}
              className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
              {item.Cost} 💰
              Acheter
            </ActionButton>
          </div>
        ))}
        <ActionButton
            onClick={async () => refreshShop()}
            className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
            20000 💰
            Refresh
        </ActionButton>
    </div>);
}