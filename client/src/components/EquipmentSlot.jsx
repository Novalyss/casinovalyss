import { useState, useEffect, useRef } from "react";
import { useEvents } from "./EventsProvider";
import { apiRequest } from "./api";
import ItemCard from "./ItemCard";

export default function EquipmentSlot({ type, item, icon }) {
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);
  const { inventory } = useEvents();

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
      {/* ITEM OR ICON */}
      {item ? (
        <ItemCard item={item} />
      ) : (
        <img src={icon} alt={type} className="w-16 h-16" />
      )}

      {menu && (
        <div
          ref={menuRef}
          style={{ position: "fixed", top: menu.y, left: menu.x }}
          className="z-50 p-2 rounded cursor-pointer bg-white shadow-md"
        >
          <div className="grid grid-rows-[auto_auto_1fr] gap-2">
            {/* Bouton Enlever */}
            {item && (
              <button
                className="px-4 py-2 bg-gray-200 w-full text-left rounded text-center"
                onClick={async () => {
                  console.log("Unequip:", type);
                  await apiRequest("/unequip", "POST", { slot: type }, (data) => {
                    if (data.success === "KO")
                      addToast(JSON.parse(data.data), "error");
                    else if (data.success === "PENDING")
                      addToast(JSON.parse(data.data), "warning");
                  });
                  handleClose();
                }}
              >
                Enlever
              </button>
            )}

            {/* Label */}
            <div className="text-sm uppercase tracking-wide text-black border-b border-gray-400 pb-1 text-center">
              Objets équipables :
            </div>

            {/* Liste des items */}
            <div className="grid grid-cols-3 gap-2">
              {inventory
                .filter((i) => i.Type === type)
                .map((equip) => (
                  <div
                    key={equip.Id}
                    className="flex items-center justify-center p-1 rounded cursor-pointer hover:bg-gray-100"
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