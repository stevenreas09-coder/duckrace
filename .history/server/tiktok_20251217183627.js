import { createServer } from "http";
import { Server } from "socket.io";
import { TikTokLiveConnection, WebcastEvent } from "tiktok-live-connector";

// ===============================
// 1. Server setup
// ===============================
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const tiktokUsername = "yournameis4u";
const connection = new TikTokLiveConnection(tiktokUsername);

// ===============================
// 2. In-memory state
// ===============================
const chats = [];
const likers = new Map();
const viewers = new Map();

// ===============================
// 3. TikTok connection
// ===============================
connection
  .connect()
  .then((state) => {
    console.info(`✅ Connected to TikTok Room: ${state.roomId}`);
  })
  .catch((err) => {
    console.error("❌ TikTok Connection Error:", err);
  });

// ===============================
// 4. Socket.io connection
// ===============================
io.on("connection", (socket) => {
  console.log("🟢 Frontend connected:", socket.id);

  socket.emit("initial-data", {
    chats,
    likers: Array.from(likers.entries()).map(([username, info]) => ({
      username,
      likeCount: info.likeCount,
    })),
    viewers: Array.from(viewers.values()),
  });
});

// ===============================
// 5. TikTok Events
// ===============================

// CHAT
connection.on(WebcastEvent.CHAT, (data) => {
  console.log("CHAT event received:", data); // <-- debug
  const chat = {
    user: data.uniqueId,
    comment: data.comment,
    profilePictureUrl: data.profilePictureUrl,
    timestamp: Date.now(),
  };

  chats.push(chat);
  if (chats.length > 100) chats.shift();

  io.emit("tiktok-chat", chat);
});

// LIKE
connection.on(WebcastEvent.LIKE, (data) => {
  console.log("LIKE event received:", data); // <-- debug
  if (data.uniqueId) {
    likers.set(data.uniqueId, { likeCount: data.likeCount });
    io.emit(
      "tiktok-like",
      Array.from(likers.entries()).map(([username, info]) => ({
        username,
        likeCount: info.likeCount,
      }))
    );
  }
});

// ROOM_USER
connection.on(WebcastEvent.ROOM_USER, (data) => {
  console.log("ROOM_USER event received:", data);

  data.ranksList?.forEach((v) => {
    const user = v.user;
    if (!user?.uniqueId) return;

    viewers.set(user.uniqueId, {
      uniqueId: user.uniqueId,
      nickname: user.nickname,
      avatar: user.profilePictureUrl,
    });
  });

  io.emit("room-user", {
    viewers: Array.from(viewers.values()),
    viewerCount: data.viewerCount,
  });
});

// ===============================
// 6. Start server
// ===============================
const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket server running on http://localhost:${PORT}`);
});
