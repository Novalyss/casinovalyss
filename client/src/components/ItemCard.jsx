import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ItemDetails from "./ItemDetails";
import { getBorderClass } from "../lib/utils";

const itemImages = {
  Helm: "../assets/stuff/Helm.png",
  Gloves: "../assets/stuff/Gloves.png",
  Chest: "../assets/stuff/Chest.png",
  Legs: "../assets/stuff/Legs.png",
  Boots: "../assets/stuff/Boots.png",
  Weapon: "../assets/stuff/Weapon.png"
};

export default function ItemCard({ item }) {

  return (
    <div
      key={item.Id}
      className={`relative cursor-pointer border-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center overflow-hidden ${getBorderClass(item)}`}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer rounded-lg shadow-md">
              <img
                src={itemImages[item.Type]}
                alt={item.Type}
                className="w-10 h-10 sm:w-16 sm:h-16 object-cover"
              />
            </span>
          </TooltipTrigger>

          {/* Un seul TooltipContent pour contenir les deux comparaisons */}
          <TooltipContent className="!p-0">
            <ItemDetails item={item} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}