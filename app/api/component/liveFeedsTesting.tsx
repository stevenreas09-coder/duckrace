"use client";

import { useEffect, useState } from "react";

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
interface View {
  username: string;
  profilePic: string;
  timestamp: string;
}

export default function LiveFeedTesting() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [viewers, setViewers] = useState<View[]>([]);

  useEffect(() => {
    // Fake data generator
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString();

      // Random comment
      setComments((prev) =>
        [
          {
            username: "TestUser",
            message: "Hello world!",
            profilePic: "",
            timestamp,
          },
          ...prev,
        ].slice(0, 5)
      );

      // Random like
      setLikes((prev) =>
        [
          { userId: "1", username: "Liker", profilePic: "", timestamp },
          ...prev,
        ].slice(0, 5)
      );

      // Random gift
      setGifts((prev) =>
        [
          { user: "GiftGiver", giftName: "Rose", giftValue: 1, timestamp },
          ...prev,
        ].slice(0, 5)
      );
      // Random comment
      setViewers((prev) =>
        [
          {
            username: "TestUser",
            profilePic: "",
            timestamp,
          },
          ...prev,
        ].slice(0, 5)
      );
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div>
        <h3>Comments</h3>
        {comments.map((c, i) => (
          <div key={i}>
            <strong>{c.username}</strong>: {c.message}{" "}
            <em>({new Date(c.timestamp).toLocaleTimeString()})</em>
          </div>
        ))}
      </div>

      <div>
        <h4>Likes</h4>
        {likes.map((l, i) => (
          <div key={i}>
            {l.username} liked{" "}
            <em>({new Date(l.timestamp).toLocaleTimeString()})</em>
          </div>
        ))}
      </div>

      <div>
        <h3>Gifts</h3>
        {gifts.map((g, i) => (
          <div key={i}>
            {g.user} sent {g.giftName} ({g.giftValue}){" "}
            <em>({new Date(g.timestamp).toLocaleTimeString()})</em>
          </div>
        ))}
      </div>
      <div>
        <h3>Viewers</h3>
        {viewers.map((l, i) => (
          <div key={i}>{l.username} is playing </div>
        ))}
      </div>
    </div>
  );
}
