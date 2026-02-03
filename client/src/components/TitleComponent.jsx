import { useState, useEffect } from "react";
import { useToast } from "./Toaster";
import { apiRequest } from "../lib/api";
import ActionButton from "./ActionButton";

export default function TitleComponent({ titles, currentTitle }) {
  const [selectedTitle, setSelectedTitle] = useState(currentTitle || "");
  const { addToast } = useToast();

   useEffect(() => {
    if (currentTitle) {
      setSelectedTitle(currentTitle);
    }
  }, [currentTitle]);

  const handleSubmit = async () => {
    if (!selectedTitle) {
      return;
    }

    await apiRequest("/changeTitle", "POST", { title: selectedTitle }, (data) => {
      if (data.success === "KO") {
        addToast(data.data, "error");
      } else if (data.success === "PENDING") {
        addToast(data.data, "warning");
      } else {
        addToast(JSON.parse(data.data), "success");
      }
    });
  };

  return (
    <div className="p-4 m-4 bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto border">
      <h2 className="text-lg font-semibold text-center sm:text-left">Changer de titre</h2>

      {/* Liste déroulante */}
      <select
        value={selectedTitle}
        onChange={(e) => setSelectedTitle(e.target.value)}
        className="border rounded-lg p-2 w-full sm:w-auto"
      >
        {titles === null || titles.length === 0 ? (
          <option disabled>Aucun titre disponible</option>
        ) : (
          titles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))
        )}
      </select>

      {/* Bouton Valider */}
      <ActionButton
        onClick={handleSubmit}
        className="px-4 py-2 rounded-lg text-white transition bg-blue-600 hover:bg-blue-700"
      >
        Valider
      </ActionButton>
    </div>
  );
}