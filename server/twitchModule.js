const tmi = require("tmi.js");
require("dotenv").config(); // Load .env variables

module.exports = function attachTwitch(io) {
  let viewers = new Set();

  io.on("connection", (socket) => {
    console.log("Frontend connected (Twitch):", socket.id);
    socket.emit("initialDataTwitch", {
      viewers: Array.from(viewers),
    });
  });

  const twitchClient = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true, secure: true },
    identity: {
      username: process.env.TWITCH_USERNAME,
      password: process.env.TWITCH_OAUTH,
    },
    channels: [process.env.TWITCH_CHANNEL],
  });

  twitchClient.connect().catch(console.error);

  twitchClient.on("chat", (channel, userstate, message, self) => {
    if (self) return;
    io.emit("twitchChat", {
      username: userstate.username,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  twitchClient.on("join", (channel, username) => {
    viewers.add(username);
    io.emit("twitchViewerJoined", {
      username,
      viewers: Array.from(viewers),
      timestamp: new Date().toISOString(),
    });
  });
};
