const TTL = 12 * 60 * 60 * 1000; // 12h en ms
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
  if (Date.now() - timestamp > TTL) {
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