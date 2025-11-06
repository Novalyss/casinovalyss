const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const { setCache, getCache, clearCache, setUserCache, getUserCache, clearUserCache, getLeaderBoardData, getAllUsers, clearShop } = require("./cache.js");
const path = require('path');
const http = require("http");
const url = require("url");
const { loadEnvData } = require("./utils/sampleLoader.js");
const dotenv = require('dotenv');

if (process.env.NODE_ENV === "example") {
  console.log("Mode exemple activé — chargement de .env.example");
  dotenv.config({ path: ".env.example" });
} else {
  dotenv.config();
}

loadEnvData();

const app = express();

// server statics files
const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));

// to automatically parse JSON in API
app.use(express.json());

// toutes les routes renvoient index.html
const indexFile = path.join(distPath, "index.html");

const server = http.createServer(app);
const router = express.Router();
app.use(router)

const wss = new WebSocket.Server({ noServer: true });
const pendingRequests = new Map();
const tokens = new Map();
const clients = new Map();
//const messageQueue = [];
let isConnected = false;

server.on("upgrade", (req, socket, head) => {

   // Vérifie le header Upgrade
  const upgradeHeader = req.headers["upgrade"];
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.destroy();
    return;
  }

  // On ne gère que les connexions sur /ws
  const { pathname } = new URL(req.url, `https://${req.headers.host}`);
  if (pathname !== "/ws") {
    socket.destroy();
    return;
  }

  const { query } = url.parse(req.url, true);
  const token = query.token;

  // Si token OK → on accepte la connexion
  if (token !== process.env.JWT_SECRET) {
    console.warn("❌ Connexion WebSocket refusée : token invalide");
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

/* SSE */
app.get("/api/events", (req, res) => {

  const token = req.query.token;

  try {
    const payload = tokens[token];
    const user = payload.display_name;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    res.write(`event: live\n`);
    res.write(`data: ${JSON.stringify(isConnected == true ? "on" : "off")}\n\n`);

    // Send All user data at connection ?
    res.write(`event: equipment\n`);
    res.write(`data: ${JSON.stringify(getUserCache(user, "equipment"))}\n\n`);

    res.write(`event: refreshShopTimer\n`);
    res.write(`data: ${JSON.stringify(getCache("refreshShopTimer"))}\n\n`);

    const leaderboard = getLeaderBoardData();
    res.write(`event: leaderboard\n`);
    res.write(`data: ${JSON.stringify(leaderboard)}\n\n`);

    // Ajout de la connexion dans la Map
    if (!clients.has(user)) {
      clients.set(user, new Set());
    }
    clients.get(user).add(res);

    // Nettoyer à la déconnexion
    req.on("close", () => {
      clients.get(user).delete(res);
      if (clients.get(user).size === 0) {
        clients.delete(user);
      }
    });
  } catch (err) {
    return res.status(401).end("Unauthorized");
  }
});

function sendToUser(user, property, data) {
  if (clients.has(user)) {
    for (const res of clients.get(user)) {
      res.write(`event: ${property}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }
}

function sendToAllUsers(property, data) {
  for (const [user, connections] of clients.entries()) {
    for (const res of connections) {
      res.write(`event: ${property}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }
}

/* SECURITY */

function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];

    // Vérifie la présence du header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];
    if (!token || !tokens[token]) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    req.user = tokens[token].display_name;
    next();
}

/* API ROUTES */

app.post("/api/auth", async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(401).json({ error: "Access token needed" });
  }

  // Récup infos user Twitch
  const resp = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Client-Id": process.env.VITE_CLIENT_ID
    }
  });

  const data = await resp.json();
  const user = data.data[0];
  let uuid = uuidv4();

  tokens[uuid] = user;
  res.json({ token: uuid });
});

/* GLOBAL / CONFIG */

app.get("/api/quests", authenticateUser, async (req, res) => {
  const quests = getCache("quests");
  return res.json({ success: true, result: quests });
});

app.get("/api/leaderboard", authenticateUser, async (req, res) => {
  const leaderboard = getLeaderBoardData();
  return res.json({ success: true, result: leaderboard });
});

app.get("/api/players", authenticateUser, async (req, res) => {
  const players = getAllUsers();
  return res.json({ success: true, result: players });
});

app.get("/api/equipmentConfig", authenticateUser, async (req, res) => {
  const equipmentConfig = getCache("equipmentConfig");
  return res.json({ success: true, result: equipmentConfig });
});

app.get("/api/classesConfig", authenticateUser, async (req, res) => {
  const classesConfig = getCache("classesConfig");
  return res.json({ success: true, result: classesConfig });
});

app.post("/api/armory", authenticateUser, async (req, res) => {

  if (req.body?.user !== undefined) {
    // retrieve equip
    let equipment = getUserCache(req.body.user, "equipment");
     if (!equipment) {
      equipment = await sendToWebSocket({"user": req.body.user, "action": "equipment"});
      equipment = equipment.data;
    } else {
      equipment = JSON.stringify(equipment);
    }

    // retrieve class
    let classe = getUserCache(req.body.user, "class");
    if (!classe) {
      classe = await sendToWebSocket({"user": req.body.user, "action": "class"});
      classe = JSON.parse(classe.data);
    }

    // retrieve level
    let level = getUserCache(req.body.user, "level");
    if (!level) {
      level = await sendToWebSocket({"user": req.body.user, "action": "level"});
      level = level.data;
    } else {
      level = JSON.stringify(level);
    }

    // retrieve stats
    let stats = getUserCache(req.body.user, "casinostats");
    if (!stats) {
      stats = await sendToWebSocket({"user": req.body.user, "action": "casinostats"});
      stats = JSON.parse(stats.data);
    }

    // retrieve title
    let currentTitle = getUserCache(req.body.user, "currentTitle");
    if (currentTitle === null) {
      currentTitle = await sendToWebSocket({"user": req.body.user, "action": "currentTitle"});
      if (currentTitle.status == "OK") {
        currentTitle = currentTitle.data;
      } else {
        currentTitle = "";
      }
    }

    return res.json({ success: true, result: { equipment, classe, level, stats, currentTitle } });
  }
  return res.status(400).end("Bad Request");
});

/* USER SPECIFIC */

app.get("/api/me", authenticateUser, async (req, res) => {
  return res.json({ success: true, result: req.user });
});

app.get("/api/progress", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "progress");
  if (cached) {
    sendToUser(req.user, "progress", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "progress"});
  return res.json({ success: false });
});

app.get("/api/shop", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "shop");
  if (cached) {
    sendToUser(req.user, "shop", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "shop"});
  return res.json({ success: false });
});

app.get("/api/account", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "account");
  
  if (cached) {
    sendToUser(req.user, "account", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "account"});
  return res.json({ success: false });
});

app.get("/api/inventory", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "inventory");
  
  if (cached) {
    sendToUser(req.user, "inventory", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "inventory"});
  return res.json({ success: false });
});

app.get("/api/equipment", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "equipment");
  
  if (cached) {
    sendToUser(req.user, "equipment", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "equipment"});
  return res.json({ success: false });
});

app.get("/api/class", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "class");
  
  if (cached) {
    sendToUser(req.user, "class", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "class"});
  return res.json({ success: false });
});

app.get("/api/currentTitle", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "currentTitle");
  
  if (cached) {
    sendToUser(req.user, "currentTitle", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "currentTitle"});
  return res.json({ success: false });
});

app.get("/api/titles", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "titles");
  
  if (cached) {
    sendToUser(req.user, "titles", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "titles"});
  return res.json({ success: false });
});

app.post("/api/changeTitle", authenticateUser, async (req, res) => {

  if (req.body?.title === undefined) {
    return res.status(400).end("Bad Request");
  }
  
  const result = await sendToWebSocket({"user": req.user, "action": "changeTitle", "title": req.body.title});

  res.json({ success: result.status, data: result.data });
});

app.post("/api/changeClass", authenticateUser, async (req, res) => {

  if (req.body?.class === undefined) {
    return res.status(400).end("Bad Request");
  }
  
  const result = await sendToWebSocket({"user": req.user, "action": "changeClass", "classe": req.body.class});

  res.json({ success: result.status, data: result.data });
});

app.get("/api/level", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "level");
  
  if (cached) {
    sendToUser(req.user, "level", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "level"});
  return res.json({ success: false });
});

app.get("/api/casinostats", authenticateUser, async (req, res) => {
  const cached = getUserCache(req.user, "casinostats");
  
  if (cached) {
    sendToUser(req.user, "casinostats", cached);
    return res.json({ success: true, result: cached });
  }
  sendToWebSocket({"user": req.user, "action": "casinostats"});
  return res.json({ success: false });
});

/* ITEM MANAGEMENT: */

app.put("/api/refresh", authenticateUser, async (req, res) => {
  const result = await sendToWebSocket({"user": req.user, "action": "refresh"});
  return res.json({ success: result.status, data: result.data });
});

app.post("/api/buy", authenticateUser, async (req, res) => {

  if (req.body?.itemId !== undefined) {
    const result = await sendToWebSocket({"user": req.user, "action": "buy", itemId: req.body.itemId});
    return res.json({ success: result.status, data: result.data });
  }
  return res.status(400).end("Bad Request");
});

app.post("/api/delete", authenticateUser, async (req, res) => {
  if (req.body?.itemId !== undefined) {
    const result = await sendToWebSocket({"user": req.user, "action": "delete", itemId: req.body.itemId});
    return res.json({ success: result.status, data: result.data });
  }
  return res.status(400).end("Bad Request");
});

app.post("/api/equip", authenticateUser, async (req, res) => {
  if (req.body?.itemId !== undefined) {
    const result = await sendToWebSocket({"user": req.user, "action": "equip", itemId: req.body.itemId});
    return res.json({ success: result.status, data: result.data });
  }
  return res.status(400).end("Bad Request");
});

app.post("/api/unequip", authenticateUser, async (req, res) => {
  if (req.body?.slot !== undefined) {
    const result = await sendToWebSocket({"user": req.user, "action": "unequip", itemSlot: req.body.slot});
    return res.json({ success: result.status, data: result.data });
  }
  return res.status(400).end("Bad Request");
});

/* WebSocket */

async function waitWebSocketResponse(requestId) {
  // Attente de la réponse
  return new Promise((resolve, reject) => {
    pendingRequests.set(requestId, resolve);

    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        console.log("action pending with id:" + requestId);
        resolve({status: "KO", data: "\"Une erreur est survenue :(\""});
        //reject("Timeout: no response from StreamerBot");
      }
    }, 15000);
  });
}

async function sendToWebSocket(request) {
  let requestId = uuidv4();

  if (isConnected) {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ requestId, request }));
        // ici on retourne bien la promesse
        return waitWebSocketResponse(requestId);
      }
    }
  }
  /*
  else if (live == "on") { // live is on but WS is disconnected
      console.log("queue request:" + request.action.toString());
      if (!messageQueue.includes(request)) {
        // TODO: unicité sur la request
        messageQueue.push(request);
        console.log("queue lengh=" + messageQueue.length);
        return {status: "PENDING", data: "\"Action mise en attente.\""};
      }
  }
  */
  return Promise.resolve({ status: "KO", data: "\"Le casino est fermé\"" });
}

wss.on('connection', (ws) => {
  console.log("✅ Connecté à StreamerBot");
  
  isConnected = true;
  sendToAllUsers("live", "on");

  // vider la queue
  /*
  while (messageQueue.length > 0) {
    const {requestId, request} = messageQueue.shift();
    try {
      sendToWebSocket(request, requestId);
    } catch (err) {
      reject(err);
    }
  }
  */

  ws.on("message", (msg) => {
    const json = JSON.parse(msg);
    const { requestId, user, action, status, data } = json;

    console.log("requestId=" + requestId + " | user=" + user +" | action=" + action +" | status=" + status +" | data=" + data);
    
    /* specific actions */
    if (action == "reset") {
      clearUserCache();
      return;
    }

    /* handle leaderboard case */
    if (action == "leaderboard" && user == null) {
      const leaderboardData = JSON.parse(data);
      Object.entries(leaderboardData).forEach(([user, userData]) => {
        setUserCache(user, action, userData);
      });
      return;
    }

    if (action == "refreshShopTimer") {
      const refreshTimer = JSON.parse(data);
      setCache(action, refreshTimer);
      clearShop();
      sendToAllUsers("shop", null);
      sendToAllUsers("refreshShopTimer", refreshTimer);
      return;
    }

    /* generic global action */
    if (user == null) {
      setCache(action, data);
      return;
    }

    if (status == "OK") {
      setUserCache(user, action, JSON.parse(data));
      sendToUser(user, action, JSON.parse(data));
    }

        // CHANGE THIS
    /* user leaderboard update */
    if (action == "equipment") {
      const leaderboardData = JSON.parse(data);
      sendToAllUsers("leaderboard", [{ user: user, equipment: leaderboardData }]);
    }
    
    if (pendingRequests.has(requestId)) {
      console.log("resolve and delete request id:" + requestId + " data=" + data);
      pendingRequests.get(requestId)({status, data}); // On résout la promesse
      pendingRequests.delete(requestId);
    }

  });

  ws.on('close', () => {
    isConnected = false;
    sendToAllUsers("live", "off");
    console.log('StreamerBot disconnected');
  });
});

/* This API MUST be at the end */
app.get(/^(?!\/ws).*$/, (req, res) => {
  res.sendFile(indexFile);
});

/* START SERVER AT THE END OF CONFIG */
const PORT = process.env.VITE_PORT || 3000;
server.listen(PORT, () => console.log("Backend running on port 3000"));