import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CharacterComponent from '../components/CharacterComponent';
import CasinoStatsComponent from "../components/CasinoStatsComponent";
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
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  // states réactifs pour l'équipement / classe / level
  const [equipment, setEquipment] = useState(null); // null => non chargé
  const [classe, setClasse] = useState(null);
  const [level, setLevel] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
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
          setStats(res.result.stats ?? []);
          setCurrentTitle(res.result.currentTitle ?? "")
        } else {
          console.warn("Erreur ou pas de data pour", selectedUser, res);
          // fallback
          if (mounted) {
            setEquipment([]);
            setClasse("Noob");
            setLevel(1);
            setStats([]);
            setCurrentTitle("")
          }
        }
      } catch (err) {
        console.error("Erreur fetch armory:", err);
        if (mounted) {
          setEquipment([]);
          setClasse("Noob");
          setLevel(1);
          setStats([]);
          setCurrentTitle("")
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

  const handleToggleSort = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Empêche le blur de se propager
    setSortAsc((prev) => !prev);
    setIsFocused(true); // Garde la dropdown ouverte
  };

  const filteredPlayers = knownPlayers
    .slice()
    .sort((a, b) =>
      sortAsc
        ? a.localeCompare(b, "fr", { sensitivity: "base" })
        : b.localeCompare(a, "fr", { sensitivity: "base" })
    )
    .filter((p) => p.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 p-4 text-center">🛡️ Armurerie</h1>
      <div className="mt-6 border-t pt-4"/>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          🔍
        </span>
        <input
          type="text"
          placeholder="Rechercher un joueur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full p-2 border rounded text-center"
        />

        {/* Bouton de tri */}
        <div
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleToggleSort}
          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
          title={`Trier ${sortAsc ? "Z → A" : "A → Z"}`}
        >
          {sortAsc ? "🔼" : "🔽"}
        </div>

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
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full rounded-lg bg-white shadow-md p-6">
                  <CharacterComponent
                    playerName={selectedUser}
                    currentTitle={currentTitle}
                    equipment={equipment}
                    classe={classe}
                    level={level}
                    readOnly={true}
                  />
                </div>
          
                <div className="w-full rounded-lg bg-white shadow-md"> {/* remove fixed width ? */}
                  <TabComponent
                  tabs={[
                    {
                      title: <p>Statistiques</p>, // <img src="../assets/icon/Stats.png" alt="Stats" className="w-6 h-6" />
                      content: <StatsComponent equipment={equipment} equipmentConfig={equipmentConfig}/>,
                    },
                    {
                      title: <p>Compétence</p>, // <img src="../assets/icon/Id.svg" alt="Compétences" className="w-6 h-6" />
                      content: <SkillComponent classe={classe} level={level} classesConfig={classesConfig} />,
                    },
                  ]}
                />
                </div>
              </div>
              <CasinoStatsComponent casinoStats={stats} />
            </div>
          )}
         
        </div>
        
      )}
    </div>
  );
}
