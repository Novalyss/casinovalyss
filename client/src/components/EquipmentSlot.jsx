import { useState, useEffect, useRef } from "react";
import { useEvents } from "./EventsProvider";
import { apiRequest } from "../lib/api";
import ItemCard from "./ItemCard";

export default function EquipmentSlot({ type, item, icon, readOnly }) {
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);
  const { inventory, online } = useEvents();

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null);
      }
    }
    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  const handleClick = (e) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const handleClose = () => setMenu(null);

  return (
    <div className="flex items-center justify-center" onClick={handleClick}>
      {/* ITEM OU ICÔNE */}
      {item ? (
        <ItemCard item={item} />
      ) : (
        <img
          src={icon}
          alt={type}
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
        />
      )}

      {/* MENU CONTEXTUEL */}
      {!readOnly && online === "on" && menu && (
        <div
          ref={menuRef}
          style={{ position: "fixed", top: menu.y, left: menu.x }}
          className="z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-300 
                    max-w-[90vw] sm:max-w-xs text-sm sm:text-base"
        >
          <div className="grid grid-rows-[auto_auto_1fr] gap-2">
            {/* Bouton Enlever */}
            {item && (
              <button
                className="px-3 py-2 bg-gray-200 w-full text-center rounded hover:bg-gray-300 
                          transition text-xs sm:text-sm font-medium"
                onClick={async () => { /* ... */ }}
              >
                Enlever
              </button>
            )}

            {/* Label */}
            <div className="text-xs sm:text-sm uppercase tracking-wide text-black 
                            border-b border-gray-400 pb-1 text-center font-semibold">
              Objets équipables :
            </div>

            {/* Liste des items */}
            <div className="grid grid-cols-3 gap-2">
              {inventory
                .filter((i) => i.Type === type)
                .map((equip) => (
                  <div
                    key={equip.Id}
                    className="flex items-center justify-center p-1 rounded cursor-pointer 
                              hover:bg-gray-100 transition"
                    onClick={async () => {
                      console.log("Équiper:", equip);
                      await apiRequest("/equip", "POST", { itemId: equip.Id }, (data) => {
                        if (data.success === "KO") addToast(JSON.parse(data.data), "error");
                        else if (data.success === "PENDING") addToast(JSON.parse(data.data), "warning");
                      });
                      handleClose();
                    }}
                  >
                    <ItemCard item={equip} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}