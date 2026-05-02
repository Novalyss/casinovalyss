import { useState, useMemo } from "react";
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
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [statPriority, setStatPriority] = useState([]);

    const typeTranslations = {
      Helm: "Casque",
      Chest: "Cuirasse",
      Legs: "Jambières",
      Boots: "Bottes",
      Gloves: "Gants",
      Weapon: "Épée",
    };

    const statLabels = {
      Chance: "Chance",
      FlatBonus: "Bonus",
      MultBonus: "Multiplicateur",
      CooldownReduction: "Cooldown",
      CostReduction: "Coût",
    };

    const toggleType = (type) => {
      setSelectedTypes((prev) =>
        prev.includes(type)
          ? prev.filter((t) => t !== type)
          : [...prev, type]
      );
    };

    const addStatSort = (stat) => {
      if (!stat) return;

      setStatPriority((prev) => {
        if (prev.includes(stat)) return prev;
        return [...prev, stat];
      });
    };

    const removeStat = (stat) => {
      setStatPriority((prev) => prev.filter((s) => s !== stat));
    };

    const resetSort = () => {
      setStatPriority([]);
    };

    const processedInventory = useMemo(() => {
      if (!inventory)
        return [];

      return [...inventory]

        // ✅ FILTRE TYPE
        .filter((item) => selectedTypes.length === 0 || selectedTypes.includes(item.Type))

        // ✅ TRI MULTI STATS
        .sort((a, b) => {
          for (let stat of statPriority) {
            const diff = (b[stat] || 0) - (a[stat] || 0);
            if (diff !== 0) return diff;
          }
          return 0;
        });
    }, [inventory, selectedTypes, statPriority]);

    if (!inventory) {
        return <div className="text-center p-4">Chargement...</div>;
    }

    const handleItemClick = (e, item) => {
      setSelectedItem(item);
    };

    return (
      <div>
        <div className="p-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

  {/* FILTRE TYPE */}
  <div className="flex flex-wrap gap-2">
    {["Helm", "Chest", "Legs", "Boots", "Gloves", "Weapon"].map((type) => (
      <div
        key={type}
        onClick={() => toggleType(type)}
        className={`px-2 py-1 rounded border text-xs cursor-pointer ${
          selectedTypes.includes(type)
            ? "bg-blue-500 text-white"
            : "bg-gray-100"
        }`}
      >
        {typeTranslations[type] || type}
      </div>
    ))}
  </div>

  {/* TRI STATS */}
  <div className="flex items-center gap-2">
    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
      <span className="font-semibold">Tri :</span>

      {statPriority.length === 0 ? (
        <span className="text-gray-400">Aucun</span>
      ) : (
        statPriority.map((stat, index) => (
          <span
            key={stat}
            onClick={() => removeStat(stat)}
            className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium cursor-pointer hover:bg-red-200 transition cursor-pointer"
            title="Retirer du tri"
          >
            {index + 1}. {statLabels[stat] || stat} ✖
          </span>
        ))
      )}
    </div>

    <select
      onChange={(e) => addStatSort(e.target.value)}
      className="border rounded p-1 text-sm"
    >
      <option value="">Ajouter tri</option>
      <option value="Chance">Chance</option>
      <option value="FlatBonus">Bonus</option>
      <option value="MultBonus">Multiplicateur</option>
      <option value="CooldownReduction">Cooldown</option>
      <option value="CostReduction">Coût</option>
    </select>

    <button
      onClick={resetSort}
      className="text-xs px-2 py-1 bg-gray-200 rounded"
    >
      Reset
    </button>
  </div>

</div>

    <div className="grid p-4 gap-1"
      style={{
        gridTemplateColumns: "repeat(auto-fit, max(80px))",
    }}>
      {processedInventory.map((item) => (
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
          </div>
  );
}