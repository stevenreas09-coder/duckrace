"use client";
import { useEffect, useState } from "react";

export default function useLiveFeedMock() {
  const [likes, setLikes] = useState<string[]>([]);
  const [viewers, setViewers] = useState<string[]>([]);

  useEffect(() => {
    const likeNames = [
      "Anna",
      "Ben",
      "Cris",
      "Dany",
      "Eli",
      "Felix",
      "Gio",
      "Haru",
      "Ivan",
      "Jill",
      "Kira",
      "Luna",
      "Max",
      "Niko",
    ];

    const viewerNames = [
      "Viewer1",
      "Viewer2",
      "Viewer3",
      "Viewer4",
      "Viewer5",
      "Viewer6",
      "Viewer7",
      "Viewer8",
      "Viewer9",
      "Viewer10",
      "Viewer11",
      "Viewer12",
      "Viewer13",
      "Viewer14",
      "Viewer15",
    ];

    // Add like every 2–5 sec
    const likeInterval = setInterval(() => {
      const random = likeNames[Math.floor(Math.random() * likeNames.length)];
      setLikes((prev) => {
        if (prev.includes(random)) return prev;
        return [...prev, random];
      });
    }, Math.random() * 3000 + 2000);

    // Add or remove viewers every 2–4 sec
    const viewerInterval = setInterval(() => {
      const random =
        viewerNames[Math.floor(Math.random() * viewerNames.length)];

      setViewers((prev) => {
        let updated = [...prev];

        // 50% join, 50% leave
        if (Math.random() > 0.5) {
          if (!updated.includes(random)) updated.push(random);
        } else {
          updated = updated.filter((v) => v !== random);
        }

        return updated;
      });
    }, Math.random() * 2000 + 2000);

    return () => {
      clearInterval(likeInterval);
      clearInterval(viewerInterval);
    };
  }, []);

  return { likes, viewers };
}
