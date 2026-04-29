import { useState, useEffect, useRef } from "react";
import { useEvents } from "./EventsProvider";
import { apiRequest } from "../lib/api";
import { useToast } from "./Toaster";
import ItemCard from "./ItemCard";
import ItemDetails from "./ItemDetails";

export default function EquipmentSlot({ type, item, icon, readOnly }) {
  const [open, setOpen] = useState(false);
  const { inventory, online } = useEvents();
  const { addToast } = useToast();

  // ESC pour fermer (UX desktop)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleUnequip = async () => {
    await apiRequest(
      "/unequip",
      "POST",
      { slot: type },
      (data) => {
        if (data.success === "KO") addToast(JSON.parse(data.data), "error");
        else if (data.success === "PENDING") addToast(JSON.parse(data.data), "warning");
        else addToast(JSON.parse(data.data), "success");
      }
    );

    setOpen(false);
  };

  const handleEquip = async (equip) => {
    await apiRequest(
      "/equip",
      "POST",
      { itemId: equip.Id },
      (data) => {
        if (data.success === "KO") addToast(JSON.parse(data.data), "error");
        else if (data.success === "PENDING") addToast(JSON.parse(data.data), "warning");
        else addToast(JSON.parse(data.data), "success");
      }
    );

    setOpen(false);
  };

  return (
    <>
      {/* SLOT */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        {item ? (<ItemCard item={item} />) : (
          <img
            src={icon}
            alt={type}
            className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
          />
        )}
      </div>

      {/* DRAWER / MODAL */}
      {open && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />

          {/* container responsive */}
          <div
            className="
              fixed z-50 bg-white shadow-xl p-3

              bottom-0 left-0 right-0 rounded-t-xl

              sm:top-1/2 sm:left-1/2 sm:right-auto sm:bottom-auto
              sm:translate-x-[-50%] sm:translate-y-[-50%]

              sm:w-auto sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl
              w-full

              sm:max-h-[90vh] sm:overflow-y-auto
              animate-slide-up
            "
          >
            <div className="flex flex-col gap-3">

              {/* ITEM SLOT */}
              <div className="flex justify-center">
                {item ? (
                  <div className="w-full max-w-md lg:max-w-3xl">
                    {/* HEADER ITEM */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-2">

                      {/* titre */}
                      <h2 className="font-bold text-left pr-2">
                        Détails de l'objet
                      </h2>

                      {/* item au centre */}
                      <div className="flex justify-center px-2">
                        <ItemCard item={item} />
                      </div>

                      {/* bouton close à droite */}
                      <div className="absolute top-1 right-1 rounded">
                        <button onClick={() => setOpen(false)} className="text-xl leading-none px-2 hover:opacity-60">
                          ✖
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ItemDetails item={item} />
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* HEADER EMPTY SLOT */}
                    <div className="absolute top-1 right-1 text-xs px-1.5 py-0.5 text-white rounded">
                        <button onClick={() => setOpen(false)} className="text-xl leading-none px-2 hover:opacity-60">
                          ✖
                        </button>
                    </div>
                    {/* ICON SLOT */}
                    <div className="flex justify-center">
                      <img
                        src={icon}
                        alt={type}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION UNEQUIP */}
              {item && !readOnly && (
                <button
                  onClick={handleUnequip}
                  className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Enlever
                </button>
              )}

              {/* LABEL */}
              {!readOnly && (
                <div className="">
                  <div className="text-center font-semibold border-b pb-1">
                  Objets équipables:
                  </div>

                  {/* INVENTORY ITEMS */}
                  <div className="grid grid-cols-3 gap-2">
                    {inventory
                      .filter((i) => i.Type === type)
                      .map((equip) => (
                        <div
                          key={equip.Id}
                          className="flex justify-center cursor-pointer hover:bg-gray-100 rounded"
                          onClick={() => handleEquip(equip)}
                        >
                          <ItemCard item={equip} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}