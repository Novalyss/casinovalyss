import { useState, useEffect } from "react";
import { useEvents } from "./EventsProvider";
import { apiRequest } from "../lib/api";
import { useToast } from "./Toaster";
import ItemCard from "./ItemCard";
import ActionButton from "./ActionButton";
import ItemDetails from "./ItemDetails";


export default function ShopComponent() {
    const { shop, online } = useEvents();
    const { addToast } = useToast();
    const [selectedItem, setSelectedItem] = useState(null);

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
            }  else {
              addToast(JSON.parse(data.data), "success");
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
            } else {
              addToast(JSON.parse(data.data), "success");
            }
        });
    };

    if (!shop) {
        return <div className="text-center p-4">Chargement...</div>;
    }

    return (
    <div className="rounded-lg bg-white shadow-md p-4 sm:p-6 text-center">

      {/* GRID SHOP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shop.map((item) => (
          <div
            key={item.Id}
            className="flex flex-col items-center text-center cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <ItemCard item={item} />

            {/* bouton visible surtout desktop */}
            <ActionButton
              onClick={(e) => {
                e.stopPropagation(); // évite d'ouvrir le drawer
                buyItem(item);
              }}
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

      {/* BOUTON REFRESH */}
      <ActionButton
        onClick={refreshShop}
        disabled={online === "off"}
        className={`mt-4 px-3 py-1 text-sm rounded transition ${
          online === "off"
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200"
        }`}
      >
        20000 💰 Refresh
      </ActionButton>

      {/* DRAWER */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedItem(null)}
          />

          {/* panel */}
          <div className="
            relative bg-white w-full sm:max-w-2xl lg:max-w-4xl
            rounded-t-2xl sm:rounded-2xl
            p-4 shadow-lg
            max-h-[90vh] overflow-y-auto
            animate-slide-up
          ">
            
            {/* HEADER */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-3 gap-x-3">
              <h2 className="font-bold text-left">Boutique</h2>

              <div className="flex justify-center">
                <ItemCard item={selectedItem} />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xl px-2"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <ItemDetails item={selectedItem} />
              </div>
            </div>

            {/* ACTION */}
            <button
              onClick={async () => {
                await buyItem(selectedItem);
                setSelectedItem(null);
              }}
              disabled={online === "off"}
              className={`w-full py-3 rounded-lg text-white font-bold ${
                online === "off"
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {selectedItem.Cost} 💰 Acheter
            </button>

          </div>
        </div>
      )}
    </div>
  );
}