import CharacterComponent from '../components/CharacterComponent';
import InventoryComponent from '../components/InventoryComponent';
import StatsComponent from '../components/StatsComponent';
import SkillComponent from '../components/SkillComponent';
import TabComponent from '../components/TabComponent';
import { useEffect, useState } from "react";
import { apiRequest } from "../components/api";

export default function Inventory() {
  const [equipmentConfig, setEquipmentConfig] = useState([]);
  const [classesConfig, setClassesConfig] = useState([]);

  useEffect(() => {
    apiRequest("/inventory");
  }, []);

  useEffect(() => {
    apiRequest("/class");
  }, []);

  useEffect(() => {
    apiRequest("/level");
  }, []);

  useEffect(() => {
    apiRequest("/equipment");
  }, []);

  useEffect(() => {
    (async () => {
      const result = await apiRequest("/equipmentConfig");
      const data = JSON.parse(result.result);
      setEquipmentConfig(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await apiRequest("/classesConfig");
      const data = JSON.parse(result.result);
      setClassesConfig(data);
    })();
    
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Colonne gauche : personnage */}
      <div className="min-w-[400px] rounded-lg">
        <CharacterComponent />
      </div>

      <div className="min-w-[400px] rounded-lg shadow-md"> {/* remove fixed width ? */}
        <TabComponent
        tabs={[
          {
            icon: <img src="../assets/icon/Bag.svg" alt="Inventaire" className="w-6 h-6" />,
            content: <InventoryComponent />,
          },
          {
            icon: <img src="../assets/icon/Stats.png" alt="Stats" className="w-6 h-6" />,
            content: <StatsComponent data={equipmentConfig}/>,
          },
          {
            icon: <img src="../assets/icon/Id.svg" alt="Compétences" className="w-6 h-6" />,
            content: <SkillComponent data={classesConfig}/>,
          },
        ]}
      />
      </div>
    </div>
  );
}