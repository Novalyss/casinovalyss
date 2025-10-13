import { useEffect } from 'react';
import { useEvents } from "../components/EventsProvider";
import { apiRequest } from "../lib/api";
import { useToast } from "../components/Toaster";
import ItemCard from "../components/ItemCard";
import ActionButton from "../components/ActionButton";


export default function ShopComponent() {
    const { shop, online } = useEvents();
    const { addToast } = useToast();

     useEffect(() => {
      if (!shop) {
          apiRequest("/shop");
        }
      }, [shop]);

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
        return <div className="text-center p-4">Chargement...</div>;
    }

    return (
    <div className="rounded-lg bg-white shadow-md p-6 text-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {shop.map((item) => (
        <div key={item.Id} className="flex flex-col items-center">
          <ItemCard item={item} />
          <ActionButton
            onClick={async () => buyItem(item)}
            disabled={online === "off"}
            className={`mt-2 px-3 py-1 text-sm rounded transition ${
              online === "off"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            {item.Cost} 💰 Acheter
          </ActionButton>
        </div>
      ))}
      </div>
      <ActionButton
        onClick={async () => refreshShop()}
        disabled={online === "off"}
        className={`mt-2 px-3 py-1 text-sm rounded transition ${
          online === "off"
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200"
        }`}
      >
        20000 💰 Refresh
      </ActionButton>
    </div>
  );
}