const { setCache,setUserCache } = require("../cache.js");

function loadEnvData() {

  if (process.env.NODE_ENV !== "example") return;

  const user = process.env.VITE_EXAMPLE_USER;
  const exampleEquipment = JSON.parse(process.env.VITE_EXAMPLE_EQUIPMENT || "{}");
  const exampleClass = process.env.VITE_EXAMPLE_CLASS;
  const exampleLevel = JSON.parse(process.env.VITE_EXAMPLE_LEVEL);
  const exampleStats = JSON.parse(process.env.VITE_EXAMPLE_STATS || "{}");
  const exampleShop = JSON.parse(process.env.VITE_EXAMPLE_SHOP || "{}");
  const exampleAccount = JSON.parse(process.env.VITE_EXAMPLE_ACCOUNT);
  const exampleInventory = JSON.parse(process.env.VITE_EXAMPLE_INVENTORY || "{}");
  const exampleQuest = JSON.parse(process.env.VITE_EXAMPLE_QUESTS || "{}");
  const leaderboard = JSON.parse(process.env.VITE_LEADERBOARD || "{}");

  setCache("quests", process.env.VITE_QUEST_CONFIG);
  setCache("equipmentConfig", process.env.VITE_EQUIPMENT_CONFIG);
  setCache("classesConfig", process.env.VITE_CLASSES_CONFIG);

  setUserCache(user, "equipment", exampleEquipment);
  setUserCache(user, "class", exampleClass);
  setUserCache(user, "level", exampleLevel);
  setUserCache(user, "casinostats", exampleStats);
  setUserCache(user, "shop", exampleShop);
  setUserCache(user, "account", exampleAccount);
  setUserCache(user, "inventory", exampleInventory);
  setUserCache(user, "casinostats", exampleStats);
  setUserCache(user, "progress", exampleQuest);

  Object.entries(leaderboard).forEach(([user, userData]) => {
      setUserCache(user, "leaderboard", userData);
  });
}

module.exports = { loadEnvData };
