const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const attachLive = require("./liveModule");
const attachTwitch = require("./twitchModule");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  attachLive(io); // TikTok
  attachTwitch(io); // Twitch

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
