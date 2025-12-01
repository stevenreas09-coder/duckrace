// server/live.js
const { Server } = require("socket.io");
const { TikTokLiveConnection } = require("tiktok-live-connector"); // use new connection
const http = require("http");

// Choose a port for your Socket.IO server
const PORT = 4000;

// Create a simple HTTP server (needed by Socket.IO)
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for testing
    methods: ["GET", "POST"],
  },
});

// Listen for frontend connections
io.on("connection", (socket) => {
  console.log("Frontend client connected");

  socket.on("disconnect", () => {
    console.log("Frontend client disconnected");
  });
});

// Replace with your TikTok username
const tiktokUsername = "yournameis4u"; // <-- change this
const liveConnection = new TikTokLiveConnection(tiktokUsername);

// Connect to TikTok live
liveConnection
  .connect()
  .then(() => console.log("Connected to TikTok live"))
  .catch((err) => console.error("Failed to connect TikTok live:", err));

// Listen for comments
liveConnection.on("chat", (data) => {
  io.emit("comment", {
    username: data.uniqueId,
    message: data.comment,
    profilePic: data.profilePic,
    timestamp: new Date().toISOString(),
  });
});

// Listen for likes
liveConnection.on("like", (data) => {
  io.emit("like", {
    userId: data.user.uniqueId,
    username: data.user.uniqueId,
    profilePic: data.user.profilePic,
    timestamp: new Date().toISOString(),
  });
});

// Listen for gifts
liveConnection.on("gift", (data) => {
  io.emit("gift", {
    user: data.user.uniqueId,
    giftName: data.giftName,
    giftValue: data.giftValue,
    timestamp: new Date().toISOString(),
  });
});

// Start the Socket.IO server
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
