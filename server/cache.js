const TTL_QUEST = 12 * 60 * 60 * 1000; // 12h en ms
const TTL_SHOP = 2 * 60 * 60 * 1000; // 2h en ms

const TTL_MAP = {
  progress: TTL_QUEST,
  shop: TTL_SHOP,
};

let userCache = {};
let cache = {};

function setCache(key, data) {
  cache[key] = data;
}

function getCache(key) {
  return cache[key] ?? null;
}

function setUserCache(userId, key, data) {
  if (!userCache[userId]) {
    userCache[userId] = {};
  }
  userCache[userId][key] = {
    data,
    timestamp: Date.now(),
  };
}

function getUserCache(userId, key) {
  if (!userCache[userId] || !userCache[userId][key]) return null;

  const { data, timestamp } = userCache[userId][key];
  
  let TTL = TTL_MAP[key] ?? null;

  if (TTL && Date.now() - timestamp > TTL) {
    // Expiré
    delete userCache[userId][key];
    return null;
  }
  return data;
}

function clearUserCache() {
  userCache = {};
}

function clearCache() {
  cache = {};
}

function getLeaderBoardData() {
  return Object.entries(userCache).map(([user, data]) => {
    const { MiniGames = 0, DailyQuests = 0, WeeklyQuests = 0 } =
      data?.leaderboard?.data || {};

    return { user, MiniGames, DailyQuests, WeeklyQuests };
  });
}

function clearShop() {
  for (const user in userCache) {
    if (userCache[user].shop) {
      delete userCache[user].shop;
    }
  }
}

function getAllUsers() {
  return Object.keys(userCache);
}

module.exports = { setCache, getCache, clearCache, setUserCache, getUserCache, clearUserCache, getLeaderBoardData, getAllUsers, clearShop };