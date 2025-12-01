"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Comment {
  username: string;
  message: string;
  profilePic: string;
  timestamp: string;
}

interface Like {
  userId: string;
  username: string;
  profilePic: string;
  timestamp: string;
}

interface Gift {
  user: string;
  giftName: string;
  giftValue: number;
  timestamp: string;
}

let socket: Socket;

export default function LiveFeed() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    // Connect to your separate Socket.IO server
    socket = io("http://localhost:4000"); // <-- specify port here

    // Listen to TikTok live comments
    socket.on("comment", (data: Comment) => {
      setComments((prev) => [data, ...prev].slice(0, 5));
    });

    // Listen to likes
    socket.on("like", (data: Like) => {
      setLikes((prev) => [data, ...prev].slice(0, 5));
    });

    // Listen to gifts
    socket.on("gift", (data: Gift) => {
      setGifts((prev) => [data, ...prev].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div>
        <h3>Comments</h3>
        {comments.map((c, i) => (
          <div key={i}>
            <strong>{c.username}</strong>: {c.message}
          </div>
        ))}
      </div>

      <div>
        <h3>Likes</h3>
        {likes.map((l, i) => (
          <div key={i}>{l.username} liked</div>
        ))}
      </div>

      <div>
        <h3>Gifts</h3>
        {gifts.map((g, i) => (
          <div key={i}>
            {g.user} sent {g.giftName} ({g.giftValue})
          </div>
        ))}
      </div>
    </div>
  );
}
