import { useEffect, useState } from "react";
import CharacterComponent from '../components/CharacterComponent';
import InventoryComponent from '../components/InventoryComponent';
import StatsComponent from '../components/StatsComponent';
import SkillComponent from '../components/SkillComponent';
import TabComponent from '../components/TabComponent';
import CasinoState from '../components/CasinoState';
import { useEvents } from "../components/EventsProvider";
import { apiRequest } from "../lib/api";


export default function Inventory() {
  const [equipmentConfig, setEquipmentConfig] = useState([]);
  const [classesConfig, setClassesConfig] = useState([]);
  const { classe, level, equipment } = useEvents();

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
    <div className="p-6">
      <CasinoState />
      <h1 className="text-2xl font-bold mb-4 p-4 text-center">⚔️ Personnage</h1>
      <div className="mt-6 border-t pt-4" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bloc personnage */}
        <div className="w-full rounded-lg bg-white shadow-md p-6">
          <CharacterComponent playerName={localStorage.getItem("userInfo")} />
        </div>

        {/* Bloc onglets */}
        <div className="w-full rounded-lg bg-white shadow-md">
          <TabComponent
            tabs={[
              {
                title: <p>Inventaire</p>,
                content: <InventoryComponent />,
              },
              {
                title: <p>Statistiques</p>,
                content: <StatsComponent equipment={equipment} equipmentConfig={equipmentConfig} />,
              },
              {
                title: <p>Compétence</p>,
                content: <SkillComponent classe={classe} level={level} classesConfig={classesConfig} />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}