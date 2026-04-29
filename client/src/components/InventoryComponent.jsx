import { useState, useEffect, useRef } from "react";
import { useEvents } from "./EventsProvider";
import { apiRequest } from "../lib/api";
import { useToast } from "./Toaster";
import ItemCard from "./ItemCard";
import ItemDetails from "./ItemDetails";

export default function InventoryComponent() {
    const { addToast } = useToast();
    const { inventory, online } = useEvents();
    const [selectedItem, setSelectedItem] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);


    const handleItemClick = (e, item) => {
      setSelectedItem(item);
    };

    if (!inventory) {
        return <div className="text-center p-4">Chargement...</div>;
    }

    return (
    <div className="grid p-4 gap-1"
      style={{
        gridTemplateColumns: "repeat(auto-fit, max(80px))",
    }}>
      {inventory.map((item) => (
        <div
          key={item.Id}
          className="flex flex-col items-center cursor-pointer"
          onClick={(e) => handleItemClick(e, item)}
        >
          <ItemCard item={item} />
        </div>
      ))}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedItem(null)}
          />

          {/* Drawer */}
          <div className="fixed z-50 bg-white shadow-xl bottom-0 left-0 right-0 rounded-t-xl p-4
                          sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:right-auto sm:translate-x-[-50%] sm:translate-y-[-50%]
                          sm:rounded-xl sm:w-[900px] sm:max-w-[95vw] sm:max-h-[90vh] sm:overflow-y-auto
                          animate-slide-up"
          >
            
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">Détails de l'objet</h2>
              <ItemCard item={selectedItem} />
              <button onClick={() => setSelectedItem(null)}>✖</button>
            </div>

            {/* Contenu item */}
            
            <ItemDetails item={selectedItem} />

            {/* Actions */}
            {online === "on" && (
              <div className="flex gap-2 mt-4">
                
              <button
                onClick={async () => {
                  await apiRequest("/equip", "POST", { itemId: selectedItem.Id }, (data) => {
                    if (data.success === "KO") addToast(JSON.parse(data.data), "error");
                    else if (data.success === "PENDING") addToast(JSON.parse(data.data), "warning");
                    else addToast(JSON.parse(data.data), "success");
                  });
                  setSelectedItem(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Équiper
              </button>

              <button
                onClick={() => setConfirmOpen(true)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Supprimer
              </button>
                
              </div>
            )}
          </div>
        </div>
      )}
      {confirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-sm shadow-lg">
            
            <p className="text-center mb-4 font-semibold">
              Confirmer la suppression ?
            </p>

            <div className="flex gap-2">
              {/* Annuler */}
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
              >
                Annuler
              </button>

              {/* Confirmer */}
              <button
                onClick={async () => {
                  await apiRequest("/delete", "POST", { itemId: selectedItem.Id }, (data) => {
                    if (data.success === "KO") addToast(JSON.parse(data.data), "error");
                    else if (data.success === "PENDING") addToast(JSON.parse(data.data), "warning");
                    else addToast(JSON.parse(data.data), "success");
                  });

                  setConfirmOpen(false);
                  setSelectedItem(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Supprimer
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}