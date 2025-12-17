// server/server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const attachLive = require("./liveModule"); // TikTok
const attachTwitch = require("./twitchModule"); // Twitch

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer((req, res) => handle(req, res));

  // Attach Socket.IO
  const io = new Server(server, {
    cors: { origin: "*" }, // allow any origin for testing
  });

  // Attach your custom live modules
  attachLive(io); // TikTok
  attachTwitch(io); // Twitch

  // Render provides PORT automatically; bind to 0.0.0.0
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT}`)
  );
});
