// server/live.js

const { Server } = require("socket.io");
const { TikTokLiveConnection } = require("tiktok-live-connector");
const http = require("http");

// Socket.IO server port
const PORT = 4000;

// Create HTTP server for Socket.IO
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// -----------------------------
// TRACK LIVE USERS
// -----------------------------
let likers = new Set();
let viewers = new Set();

// -----------------------------
// SOCKET.IO CONNECTION
// -----------------------------
io.on("connection", (socket) => {
  console.log("Frontend connected:", socket.id);

  // Send initial user lists immediately
  socket.emit("initialData", {
    likers: Array.from(likers),
    viewers: Array.from(viewers),
  });

  socket.on("disconnect", () => {
    console.log(`Frontend disconnected: ${socket.id}`);
  });
});

// -----------------------------
// TIKTOK LIVE CONNECTION
// -----------------------------
const tiktokUsername = "yournameis4u"; // <-- Change to your TikTok @username
const liveConnection = new TikTokLiveConnection(tiktokUsername);

// Connect to TikTok
liveConnection
  .connect()
  .then(() => console.log("Connected to TikTok LIVE"))
  .catch((err) => console.error("TikTok connection failed:", err));

// -----------------------------
// EVENTS FROM TIKTOK
// -----------------------------

// COMMENTS (chat)
liveConnection.on("chat", (data) => {
  io.emit("comment", {
    username: data.uniqueId,
    message: data.comment,
    profilePic: data.profilePic,
    timestamp: new Date().toISOString(),
  });
});

// LIKES → Track Premium Participants
liveConnection.on("like", (data) => {
  const user = data.user.uniqueId;
  const pic = data.user.profilePic;

  likers.add(user); // store premium user

  io.emit("like", {
    username: user,
    profilePic: pic,
    likers: Array.from(likers), // send updated list
    timestamp: new Date().toISOString(),
  });
});

// GIFTS (optional use)
liveConnection.on("gift", (data) => {
  io.emit("gift", {
    username: data.user.uniqueId,
    giftName: data.giftName,
    giftValue: data.giftValue,
    profilePic: data.user.profilePic,
    timestamp: new Date().toISOString(),
  });
});

// VIEWERS JOINING ROOM → Track Regular Participants
liveConnection.on("roomUser", (data) => {
  if (data.users && data.users.length > 0) {
    data.users.forEach((user) => {
      viewers.add(user.uniqueId);

      io.emit("viewerJoined", {
        username: user.uniqueId,
        profilePic: user.profilePic,
        viewers: Array.from(viewers), // send updated list
        timestamp: new Date().toISOString(),
      });
    });
  }

  // Also broadcast live viewer count if available
  if (data.viewerCount !== undefined) {
    io.emit("viewers", {
      viewerCount: data.viewerCount,
      timestamp: new Date().toISOString(),
    });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
