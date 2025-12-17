module.exports = {
  apps: [
    {
      name: "nextjs",
      script: "npm",
      args: "run start",
      env: {
        PORT: process.env.PORT || 3000,
      },
    },
    {
      name: "live",
      script: "npx",
      args: "ts-node server/live.js",
    },
    {
      name: "twitch",
      script: "npx",
      args: "ts-node server/twitch.js",
    },
  ],
};
