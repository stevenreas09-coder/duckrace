// server/twitch.js
const { Server } = require("socket.io");
const tmi = require("tmi.js"); // Twitch IRC client
const http = require("http");
require("dotenv").config();

const PORT = 4001; // different port for Twitch
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let viewers = new Set();
let followers = new Set();

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Frontend connected:", socket.id);
  socket.emit("initialData", {
    viewers: Array.from(viewers),
    followers: Array.from(followers),
  });

  socket.on("disconnect", () => {
    console.log("Frontend disconnected:", socket.id);
  });
});

// Twitch IRC setup
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH, // get from https://twitchapps.com/tmi/
  },
  channels: [process.env.TWITCH_CHANNEL],
});

twitchClient.connect().catch(console.error);

// Chat messages
twitchClient.on("chat", (channel, userstate, message, self) => {
  if (self) return;
  io.emit("chat", {
    username: userstate.username,
    message,
    timestamp: new Date().toISOString(),
  });
});

// Followers (example using mock, Twitch API needed for real-time)
twitchClient.on("join", (channel, username, self) => {
  viewers.add(username);
  io.emit("viewerJoined", {
    username,
    viewers: Array.from(viewers),
    timestamp: new Date().toISOString(),
  });
});

server.listen(PORT, () => {
  console.log(`Twitch Socket.IO server running on http://localhost:${PORT}`);
});
