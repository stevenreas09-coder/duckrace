const { TikTokLiveConnection } = require("tiktok-live-connector");
require("dotenv").config(); // Load .env variables

module.exports = function attachLive(io) {
  let likers = new Set();
  let viewers = new Set();

  io.on("connection", (socket) => {
    console.log("Frontend connected (TikTok):", socket.id);
    socket.emit("initialDataTikTok", {
      likers: Array.from(likers),
      viewers: Array.from(viewers),
    });
  });

  const tiktokUsername = process.env.TIKTOK_USERNAME;

  let liveConnection;
  try {
    liveConnection = new TikTokLiveConnection(tiktokUsername);
    liveConnection
      .connect()
      .then(() => console.log("Connected to TikTok LIVE"))
      .catch((err) => io.emit("tiktokError", { message: err.message }));
  } catch (err) {
    io.emit("tiktokError", { message: err.message });
  }

  if (!liveConnection) return;

  liveConnection.on("chat", (data) => {
    io.emit("comment", {
      username: data.uniqueId,
      message: data.comment,
      profilePic: data.profilePic,
      timestamp: new Date().toISOString(),
    });
  });

  liveConnection.on("like", (data) => {
    likers.add(data.user.uniqueId);
    io.emit("like", {
      username: data.user.uniqueId,
      profilePic: data.user.profilePic,
      likers: Array.from(likers),
      timestamp: new Date().toISOString(),
    });
  });

  liveConnection.on("roomUser", (data) => {
    if (data.users) {
      data.users.forEach((u) => viewers.add(u.uniqueId));
      io.emit("viewerJoined", { viewers: Array.from(viewers) });
    }
    if (data.viewerCount !== undefined)
      io.emit("viewers", { viewerCount: data.viewerCount });
  });
};
