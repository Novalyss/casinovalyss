import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CharacterComponent from '../components/CharacterComponent';
import StatsComponent from '../components/StatsComponent';
import SkillComponent from '../components/SkillComponent';
import TabComponent from '../components/TabComponent';
import { apiRequest } from "../lib/api";
import { deserializeItem } from "../lib/utils";

export default function Armory() {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [knownPlayers, setKnownPlayers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // states réactifs pour l'équipement / classe / level
  const [equipment, setEquipment] = useState(null); // null => non chargé
  const [classe, setClasse] = useState(null);
  const [level, setLevel] = useState(null);
  const [loadingCharacter, setLoadingCharacter] = useState(false);
  const [equipmentConfig, setEquipmentConfig] = useState([]);
  const [classesConfig, setClassesConfig] = useState([]);

  const selectedUser = searchParams.get("user");

  async function getAllPlayers() {
    try {
      const res = await apiRequest("/players");
      if (res?.success) setKnownPlayers(res.result || []);
    } catch (err) {
      console.error("Erreur fetch players:", err);
    }
  }

  useEffect(() => {
    getAllPlayers();
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

  // --> Requête quand selectedUser change
  useEffect(() => {
    // si pas de joueur sélectionné, reset les valeurs (ou tu peux les laisser)
    if (!selectedUser) {
      setEquipment(null);
      setClasse(null);
      setLevel(null);
      return;
    }

    let mounted = true;
    setLoadingCharacter(true);

    (async () => {
      try {
        const res = await apiRequest("/armory", "POST", { user: selectedUser });

        // si ton apiRequest utilise callback-style, remplace par la version callback.
        if (res?.success && res.result) {
          if (!mounted) return;

          const data = JSON.parse(res.result.equipment);
          const items = data.map(deserializeItem);
          const playerStuff = items.reduce((acc, item) => {
            acc[item.Type] = item;
            return acc;
          }, {});

          setEquipment(playerStuff ?? []);
          setClasse(res.result.classe ?? "Noob");
          setLevel(res.result.level ?? 1);
        } else {
          console.warn("Erreur ou pas de data pour", selectedUser, res);
          // fallback
          if (mounted) {
            setEquipment([]);
            setClasse("Noob");
            setLevel(1);
          }
        }
      } catch (err) {
        console.error("Erreur fetch armory:", err);
        if (mounted) {
          setEquipment([]);
          setClasse("Noob");
          setLevel(1);
        }
      } finally {
        if (mounted) setLoadingCharacter(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedUser]);

  const handleSelect = (user) => {
    navigate(`?user=${encodeURIComponent(user)}`);
    setIsFocused(false);
    setSearch(user);
  };

  const filteredPlayers = knownPlayers.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">⚔️ Armurerie</h1>

      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un joueur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full p-2 border rounded text-center"
        />

        {isFocused && filteredPlayers.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
            {filteredPlayers.map((player) => (
              <div
                key={player}
                onClick={() => handleSelect(player)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {player}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="mt-6">
          {loadingCharacter ? (
            <div className="text-gray-500">Chargement...</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="min-w-[400px] rounded-lg">
                <CharacterComponent
                  playerName={selectedUser}
                  equipment={equipment}
                  classe={classe}
                  level={level}
                  readOnly={true}
                />
              </div>
        
              <div className="min-w-[400px] rounded-lg shadow-md"> {/* remove fixed width ? */}
                <TabComponent
                tabs={[
                  {
                    icon: <img src="../assets/icon/Stats.png" alt="Stats" className="w-6 h-6" />,
                    content: <StatsComponent equipment={equipment} equipmentConfig={equipmentConfig}/>,
                  },
                  {
                    icon: <img src="../assets/icon/Id.svg" alt="Compétences" className="w-6 h-6" />,
                    content: <SkillComponent classe={classe} level={level} classesConfig={classesConfig} />,
                  },
                ]}
              />
              </div>
            </div>
          )}
         
        </div>
        
      )}
    </div>
  );
}
