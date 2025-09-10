import { useEvents } from "./EventsProvider";
import EquipmentSlot from "./EquipmentSlot";

const typeIcons = {
  Helm: "../assets/icon/Helm.svg",
  Gloves: "../assets/icon/Gloves.svg",
  Chest: "../assets/icon/Chest.svg",
  Legs: "../assets/icon/Legs.svg",
  Boots: "../assets/icon/Boots.svg",
  Weapon: "../assets/icon/Weapon.svg"
};

const classImage = {
  Leprechaun: "../assets/class/Leprechaun.png",
  Pirate: "../assets/class/Pirate.png",
  Voleur: "../assets/class/Voleur.png",
  Magicien: "../assets/class/Magicien.png",
  Enchanteur: "../assets/class/Enchanteur.png",
  Ouvrier: "../assets/class/Ouvrier.png",
  Pyromancien: "../assets/class/Pyromancien.png",
  Brigand: "../assets/class/Brigand.png"
}

export default function CharacterComponent() {
  const { equipment, classe, level } = useEvents();
  const playerName = localStorage.getItem("userInfo");

  if (!equipment || !classe || !level) {
      return <div className="text-center p-4">⏳ Chargement...</div>;
  }

  return (
    <div className="w-100 h-100 relative mx-auto grid grid-rows-5 grid-cols-4 gap-2 rounded-lg shadow-md">

      {/* Image de fond */}
      {classe && classe !== "null" && (
        <img
          src={classImage[classe]}
          alt="Classe"
          className="absolute inset-0 w-full h-full object-contain opacity-60 pointer-events-none"
        />
      )}

      {/* Player Plate */}
      <div className="row-start-1 row-end-2 col-start-2 col-end-4 flex items-start">
        <div
          className="w-full bg-gradient-to-b from-yellow-200 to-yellow-400 
                    border-4 border-black rounded-xl px-4 py-2 
                    shadow-lg text-black font-bold tracking-wide text-center"
        >
          {playerName}
        </div>
      </div>

      {/* Casque */}
      <div className="row-start-1 row-end-2 col-start-1 col-end-1 flex justify-center">
        <EquipmentSlot
          type="Helm"
          item={equipment["Helm"]}
          icon={typeIcons["Helm"]}
        />
      </div>

      {/* Gants */}
      <div className="row-start-3 row-end-4 col-start-1 col-end-2 flex justify-center">
        <EquipmentSlot
          type="Gloves"
          item={equipment["Gloves"]}
          icon={typeIcons["Gloves"]}
        />
      </div>

      {/* Arme */}
      <div className="row-start-5 row-end-6 col-start-1 col-end-2 flex justify-center">
        <EquipmentSlot
          type="Weapon"
          item={equipment["Weapon"]}
          icon={typeIcons["Weapon"]}
        />
      </div>

      {/* Torse */}
      <div className="row-start-1 row-end-2 col-start-4 col-end-5 flex justify-center">
        <EquipmentSlot
          type="Chest"
          item={equipment["Chest"]}
          icon={typeIcons["Chest"]}
        />
      </div>

      {/* Jambes */}
      <div className="row-start-3 row-end-4 col-start-4 col-end-5 flex justify-center">
        <EquipmentSlot
          type="Legs"
          item={equipment["Legs"]}
          icon={typeIcons["Legs"]}
        />
      </div>

      {/* Pieds */}
      <div className="row-start-5 row-end-6 col-start-4 col-end-5 flex justify-center">
        <EquipmentSlot
          type="Boots"
          item={equipment["Boots"]}
          icon={typeIcons["Boots"]}
        />
      </div>

      {/* Classe */}
      <div className="row-start-5 row-end-6 col-start-2 col-end-4 flex items-end justify-center">
        <div
          className="w-full bg-gradient-to-b from-yellow-200 to-yellow-400 
                    border-4 border-black rounded-xl px-4 py-2 
                    shadow-lg text-black font-bold tracking-wide text-center">
          <div>{classe == "null" ? "Noob" : classe}</div>
          <div>Niveau {level}</div>
        </div>
      </div>

    </div>
  );
}