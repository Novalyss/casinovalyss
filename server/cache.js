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

module.exports = { setCache, getCache, clearCache, setUserCache, getUserCache, clearUserCache };