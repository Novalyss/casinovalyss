import React, { useState, useEffect } from "react";
import { apiRequest } from "../lib/api";
import { useToast } from "./Toaster";
import ActionButton from "./ActionButton";

const classesList = [
  "Brigand",
  "Leprechaun",
  "Magicien",
  "Voleur",
  "Enchanteur",
  "Pirate",
  "Ouvrier",
  "Pyromancien",
];

const classDescriptions = {
  Leprechaun: "Est plus chanceux que la moyenne.",
  Pirate: "Gagne un multiplicateur de potatos bonus.",
  Voleur: "Reçoit un bonus de potatos lorsqu’il gagne.",
  Magicien: "A une chance d’obtenir un tirage bonus.",
  Enchanteur: "Peut !enchanter son prochain tirage pour un boost de chance.",
  Ouvrier: "Est payé après avoir déplacé un certain nombre de barres de fer.",
  Pyromancien: "Bénéficie d’un bonus de chance sous un certain seuil de potatos.",
  Brigand: "Peut !voler le casino après plusieurs parties.",
};

export default function ChangeClassComponent({ classe }) {
  const { addToast } = useToast();
  const [selectedClass, setSelectedClass] = useState(classe || "");

  useEffect(() => {
    if (classe) {
      setSelectedClass(classe);
    }
  }, [classe]);

  const handleSubmit = async () => {
    if (selectedClass == classe) {
      return;
    }
    apiRequest("/changeClass", "POST", { class: selectedClass }, (data) => {
        console.log("Callback change class:", data);
        if (data.success == "KO") {
            addToast(JSON.parse(data.data), "error");
        } else if (data.success == "PENDING") {
            addToast(JSON.parse(data.data), "warning");
        }
    });
  }

  return (
    <div className="p-4 m-2 bg-white rounded-xl shadow-md border max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
        {/* Ligne 1 */}
        <h2 className="text-lg font-semibold">Changer de classe</h2>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border rounded-lg p-2 w-full text-center"
        >
          {classesList.map((classeAvailable) => (
            <option key={classeAvailable} value={classeAvailable}>
              {classeAvailable}
            </option>
          ))}
        </select>

        <ActionButton
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg text-white transition bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          Valider
        </ActionButton>

        {/* Ligne 2 */}
        <h2 className="text-lg font-semibold sm:col-span-1 mt-2 sm:mt-0">
          Info Classe
        </h2>
        <div className="sm:col-span-2 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-inner">
          {classDescriptions[selectedClass] || "Aucune information disponible."}
        </div>
      </div>
    </div>
  );
}