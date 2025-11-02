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
  Leprechaun: "../assets/class/Leprechaun.webp",
  Pirate: "../assets/class/Pirate.webp",
  Voleur: "../assets/class/Voleur.webp",
  Magicien: "../assets/class/Magicien.webp",
  Enchanteur: "../assets/class/Enchanteur.webp",
  Ouvrier: "../assets/class/Ouvrier.webp",
  Pyromancien: "../assets/class/Pyromancien.webp",
  Brigand: "../assets/class/Brigand.webp"
}

export default function CharacterComponent({
  playerName,
  currentTitle,
  readOnly = false,
  equipment: equipmentProp,
  classe: classeProp,
  level: levelProp,
}) {
    const { equipment: equipmentSSE, classe: classeSSE, level: levelSSE } = useEvents();

    const equipment = equipmentProp ?? equipmentSSE;
    const classe = classeProp ?? classeSSE;
    const level = levelProp ?? levelSSE;

  if (!equipment || !classe || !level) {
      return <div className="text-center p-4">Chargement...</div>;
  }

  return (
    <div
      className="relative mx-auto grid grid-rows-5 grid-cols-4 gap-2 rounded-lg 
                w-full max-w-sm sm:max-w-md md:max-w-lg aspect-square"
    >
      {/* Image de fond */}
      {classe && classe !== "null" && (
        <img
          src={classImage[classe]}
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-60 pointer-events-none p-4"
        />
      )}

      {/* Player Name Plate */}
      <div className="row-start-1 row-end-2 col-start-2 col-end-4 flex items-start">
        <div
          className="w-full bg-gradient-to-b from-yellow-200 to-yellow-400 
                    border-2 sm:border-4 border-black rounded-xl px-1 py-1
                    shadow-md sm:shadow-lg text-black font-bold tracking-wide text-center text-xs sm:text-base"
        >
          <div className="w-full">
            {playerName}
          </div>
          <div className="w-full">
            {currentTitle}
          </div>
        </div>
      </div>

      {/* Casque */}
      <div className="row-start-1 row-end-2 col-start-1 flex justify-center">
        <EquipmentSlot type="Helm" item={equipment["Helm"]} icon={typeIcons["Helm"]} readOnly={readOnly} />
      </div>

      {/* Gants */}
      <div className="row-start-3 row-end-4 col-start-1 flex justify-center">
        <EquipmentSlot type="Gloves" item={equipment["Gloves"]} icon={typeIcons["Gloves"]} readOnly />
      </div>

      {/* Arme */}
      <div className="row-start-5 row-end-6 col-start-1 flex justify-center">
        <EquipmentSlot type="Weapon" item={equipment["Weapon"]} icon={typeIcons["Weapon"]} readOnly={readOnly} />
      </div>

      {/* Torse */}
      <div className="row-start-1 row-end-2 col-start-4 flex justify-center">
        <EquipmentSlot type="Chest" item={equipment["Chest"]} icon={typeIcons["Chest"]} readOnly={readOnly} />
      </div>

      {/* Jambes */}
      <div className="row-start-3 row-end-4 col-start-4 flex justify-center">
        <EquipmentSlot type="Legs" item={equipment["Legs"]} icon={typeIcons["Legs"]} readOnly={readOnly} />
      </div>

      {/* Pieds */}
      <div className="row-start-5 row-end-6 col-start-4 flex justify-center">
        <EquipmentSlot type="Boots" item={equipment["Boots"]} icon={typeIcons["Boots"]} readOnly={readOnly} />
      </div>

      {/* Classe */}
      <div className="row-start-5 row-end-6 col-start-2 col-end-4 flex items-end justify-center">
        <div
          className="w-full bg-gradient-to-b from-yellow-200 to-yellow-400 
                    border-2 sm:border-4 border-black rounded-xl 
                    shadow-md sm:shadow-lg text-black font-bold tracking-wide text-center text-xs sm:text-base"
        >
          <div>{classe === "null" ? "Noob" : classe}</div>
          <div>Niveau {level}</div>
        </div>
      </div>
    </div>

  );
}