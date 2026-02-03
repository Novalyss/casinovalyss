import { useState, useEffect, useRef } from "react";
import { useEvents } from "./EventsProvider";
import { apiRequest } from "../lib/api";
import ItemCard from "./ItemCard";

export default function InventoryComponent() {
    const { inventory, online } = useEvents();
    const [menu, setMenu] = useState(null);
    const menuRef = useRef(null);

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

    const handleItemClick = (e, item) => {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY, item });
    };

    const handleClose = () => setMenu(null);

    if (!inventory) {
        return <div className="text-center p-4">Chargement...</div>;
    }

    return (
    <div className="grid p-4  gap-1"
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

      {online === "on" && menu && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menu.y,
            left: menu.x,
            zIndex: 9999,
          }}
          className="p-2 rounded shadow-lg bg-white border"
        >
        <button
          onClick={async () => {
            console.log("Équiper:", menu.item);
            await apiRequest("/equip", "POST", { itemId: menu.item.Id }, (data) => {
                console.log("Callback equip:", data);
                if (data.success == "KO") {
                  addToast(JSON.parse(data.data), "error");
                } else if (data.success == "PENDING") {
                  addToast(JSON.parse(data.data), "warning");
                }
              }
            );
            handleClose();
          }}
          className="px-4 py-2 w-full text-center rounded"
        >
          Équiper
        </button>

        <button
          onClick={async () => {
            console.log("Supprimer:", menu.item);
            await apiRequest("/delete", "POST", { itemId: menu.item.Id }, (data) => {
                console.log("Callback equip:", data);
                if (data.success == "KO") {
                  addToast(JSON.parse(data.data), "error");
                } else if (data.success == "PENDING") {
                  addToast(JSON.parse(data.data), "warning");
                }
              }
            );
            handleClose();
          }}
          className="px-4 py-2 w-full text-center rounded"
        >
          Supprimer
        </button>

        </div>
      )}
    </div>
  );
}