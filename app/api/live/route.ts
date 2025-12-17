import { NextRequest } from "next/server";
import { Server as IOServer } from "socket.io";
import { TikTokLiveConnection } from "tiktok-live-connector";

const ioMap = new WeakMap<any, any>();

export async function GET(req: NextRequest) {
  const server: any =
    (req as any).request?.socket?.server ||
    (req as any)._request?.socket?.server;

  if (!server) {
    return new Response("Server not ready", { status: 500 });
  }

  let io = ioMap.get(server);

  if (!io) {
    console.log("Initializing Socket.io...");

    io = new IOServer(server, {
      path: "/api/live/socket",
      cors: { origin: "*" },
    });

    ioMap.set(server, io);

    io.on("connection", (socket: any) => {
      console.log("Client connected", socket.id);
    });

    const username = "your_tiktok_username";
    const live = new TikTokLiveConnection(username);

    live.connect().catch((err) => console.error("TikTok connect error:", err));

    live.on("chat" as any, (data: any) => {
      io.emit("comment", {
        username: data.uniqueId,
        message: data.comment,
        profilePic: data.profilePictureUrl,
      });
    });

    live.on("like" as any, (data: any) => {
      io.emit("like", {
        username: data.uniqueId,
        count: data.likeCount,
      });
    });

    live.on("gift" as any, (data: any) => {
      io.emit("gift", {
        username: data.uniqueId,
        giftName: data.giftName,
        repeatCount: data.repeatCount,
      });
    });
  }

  return new Response("Socket server running", { status: 200 });
}
