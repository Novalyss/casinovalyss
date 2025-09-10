const express = require('express');
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const { setCache, getCache, clearCache, setUserCache, getUserCache, clearUserCache } = require("./cache.js");
require('dotenv').config();

const app = express();
app.use(express.json());
const server = https.createServer({
  key: fs.readFileSync('../ssl/key.pem'),
  cert: fs.readFileSync('../ssl/cert.pem')
}, app);

const router = express.Router();
app.use(router)

const wss = new WebSocket.Server({ server });
const pendingRequests = new Map(); // ID -> resolve()
const clients = new Map();
const messageQueue = [];
let isConnected;

/* SECURITY */

function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];

    // Vérifie la présence du header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Vérifie et décode le token avec ta clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // On attache le login au request pour les routes suivantes
        req.user = decoded.displayName;

        next(); // passe à la route suivante
    } catch (err) {
        console.error("Erreur JWT:", err.message);
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
}

/* API ROUTES */

app.post("/api/auth", async (req, res) => {
  const { access_token } = req.body;

  // Récup infos user Twitch
  const resp = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Client-Id": process.env.VITE_CLIENT_ID
    }
  });

  const data = await resp.json();
  const user = data.data[0];

  // Génère un JWT signé
  const token = jwt.sign(
    {
      id: user.id,
      login: user.login,
      displayName: user.display_name,
      profileImage: user.profile_image_url,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );

  res.json({ token });
});

/* SSE */
app.get("/api/events", (req, res) => {

  const token = req.query.token;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = payload.displayName;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Ajout de la connexion dans la Map
    if (!clients.has(user)) {
      clients.set(user, new Set());
    }
    clients.get(user).add(res);

    console.log(`👤 ${user} connecté (${clients.get(user).size} connexions)`);

    // Nettoyer à la déconnexion
    req.on("close", () => {
      clients.get(user).delete(res);
      if (clients.get(user).size === 0) {
        clients.delete(user);
      }
      console.log(`❌ ${user} déconnecté`);
    });
  } catch (err) {
    return res.status(401).end("Unauthorized");
  }
});

function sendToUser(user, property, data) {
  if (clients.has(user)) {
    for (const res of clients.get(user)) {
      res.write(`event: ${property}\n`);
      res.write(`data: ${data}\n\n`);
    }
  }
}

/* END SSE */

app.get("/api/me", authenticateUser, async (req, res) => {
  return res.json({ success: true, result: req.user });
});

app.get("/api/quests", authenticateUser, async (req, res) => {
  const quests = getCache("quests");
  return res.json({ success: true, result: quests });
});

app.get("/api/leaderboard", authenticateUser, async (req, res) => {
  const leaderboard = getCache("leaderboard");
  return res.json({ success: true, result: leaderboard });
});

app.get("/api/equipmentConfig", authenticateUser, async (req, res) => {
  const equipmentConfig = getCache("equipmentConfig");
  return res.json({ success: true, result: equipmentConfig });
});

app.get("/api/classesConfig", authenticateUser, async (req, res) => {
  const classesConfig = getCache("classesConfig");
  return res.json({ success: true, result: classesConfig });
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
  console.log(req.body);
  const result = await sendToWebSocket({"user": req.user, "action": "buy", itemId: req.body.itemId});
  return res.json({ success: result.status, data: result.data });
});

app.post("/api/delete", authenticateUser, async (req, res) => {
  console.log(req.body);
  const result = await sendToWebSocket({"user": req.user, "action": "delete", itemId: req.body.itemId});
  return res.json({ success: result.status, data: result.data });
});

app.post("/api/equip", authenticateUser, async (req, res) => {
  console.log(req.body);
  const result = await sendToWebSocket({"user": req.user, "action": "equip", itemId: req.body.itemId});
  return res.json({ success: result.status, data: result.data });
});

app.post("/api/unequip", authenticateUser, async (req, res) => {
  console.log(req.body);
  const result = await sendToWebSocket({"user": req.user, "action": "unequip", itemSlot: req.body.slot});
  return res.json({ success: result.status, data: result.data });
});

/* WebSocket */
wss.on('connection', (ws) => {
  console.log("✅ Connecté à StreamerBot");
  
  isConnected = true;

  // vider la queue
  while (messageQueue.length > 0) {
    const {requestId, request} = messageQueue.shift();
    try {
      sendToWebSocket(request, requestId);
    } catch (err) {
      reject(err);
    }
  }

  ws.on("message", (msg) => {
    const json = JSON.parse(msg);
    const { requestId, user, action, status, data } = json;

    console.log(requestId);
    console.log(user);
    console.log(action);
    console.log(status);
    console.log(data);
    
    if (action == "reset") {
      clearCache();
      clearUserCache();
      return;
    }

    if (user == null) {
      setCache(action, data);
      return;
    }

    if (status == "OK") {
      setUserCache(user, action, data);
      sendToUser(user, action, data);
    }
    
    if (pendingRequests.has(requestId)) {
      console.log("resolve and delete request id:" + requestId);
      pendingRequests.get(requestId)({status, data}); // On résout la promesse
      pendingRequests.delete(requestId);
    }

  });

  ws.on('close', () => {
    isConnected = false;
    console.log('Client disconnected');
  });
});

async function sendToWebSocket(request) {
  let requestId = uuidv4();
  
  if (isConnected) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({requestId, request}));
      }
    });
  }
  else
    {
      console.log("queue request:" + request.action.toString());
      if (!messageQueue.includes(request)) {
        // TODO: unicité sur la request
        messageQueue.push(request);
        console.log("queue lengh=" + messageQueue.length);
      }
  }

  // Attente de la réponse
  return new Promise((resolve, reject) => {
    pendingRequests.set(requestId, resolve);

    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        console.log("request action " +  request + " pending with id:" + requestId);
        resolve({status: "PENDING", data: "\"Action mise en attente.\""});
        //reject("Timeout: no response from StreamerBot");
      }
    }, 15000);
  });
}

/* START SERVER AT THE END OF CONFIG */
const PORT = process.env.VITE_PORT || 3000;
server.listen(PORT, () => console.log("Backend running on port 3000"));