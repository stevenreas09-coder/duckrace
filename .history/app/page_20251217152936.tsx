"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io, Socket } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import { startingLane } from "./componets/lane";
import { FinishLane } from "./componets/finishlane";
import { duckRegular } from "./componets/ducks/duks";
import { DrawUsername } from "./componets/DrawUserName";
import {
  duckPremiumTwo,
  duckPremiumOne,
  duckPremiumZero,
  duckPremiumThree,
  duckPremiumFour,
  duckPremiumFive,
  duckPremiumSix,
  duckPremiumSeven,
  duckPremiumEight,
} from "./componets/ducks/premium";
import mockUsers from "@/public/mockUsers.json";

type Duck = {
  x: number;
  y: number;
  num: number;
  amplitude: number;
  speed: number;
  phase: number;
  type:
    | "regular"
    | "premium1"
    | "premium2"
    | "premium3"
    | "premium4"
    | "premium5"
    | "premium6"
    | "premium7"
    | "premium8"
    | "premium9";
  baseX?: number;
  speedFactor?: number;
  finished?: boolean;
  jitterPhase?: number;
  sprintSeed?: number;
  backwardSeed?: number;
  isSprinting?: boolean;
  sprintStartTime?: number;
  boostApplied?: boolean;
  boostDelay?: number;
  boostStartTime?: number;
  boostDuration?: number;
  boostTarget?: number;
  username?: string; // added so ducks can carry assigned username (mock)
};
const colors = [
  "text-red-300", // lighter red
  "text-pink-300", // light pink
  "text-blue-300", // light blue
  "text-cyan-300", // light cyan
  "text-green-300", // light green
  "text-lime-300", // lime green
  "text-yellow-200", // lighter yellow
  "text-orange-300", // light orange
  "text-purple-300", // light purple
  "text-indigo-300", // light indigo
];

export default function CanvasExample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startingLaneXRef = useRef(80);
  const grassXRef = useRef(0);
  const finishLaneXRef = useRef(800);
  const finishLaneDirectionRef = useRef(0);
  const finishLaneMovedRef = useRef(0);
  const finishLaneResetOnceRef = useRef(false);

  const [countdown, setCountdown] = useState(60);
  const countdownRef = useRef(countdown);
  countdownRef.current = countdown;

  const raceStartedRef = useRef(false);
  const lastTimeRef = useRef(0);

  // change MIN_USERS_REQUIRED to whatever X you want
  const MIN_USERS_REQUIRED = 20;

  const [likers, setLikers] = useState<string[]>([]);
  const [viewers, setViewers] = useState<string[]>([]);
  const likesRef = useRef<string[]>([]);
  const viewersRef = useRef<string[]>([]);
  likesRef.current = likers;
  viewersRef.current = viewers;

  // Rebuild signal for ducks
  const rebuildDucksRef = useRef(false);

  // track if countdown active via ref so mock generator doesn't restart repeatedly
  const countdownActiveRef = useRef(false);

  // refs for ducks and caches so main loop can read/write
  const ducksRef = useRef<Duck[]>([]);
  const duckCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const regularDuckCacheRef = useRef<Map<Duck, HTMLCanvasElement>>(new Map());

  // refs for winner / timing
  const raceStartTimeRef = useRef<number>(0);
  const winnerRef = useRef<Duck | null>(null);
  const winnerDisplayStartRef = useRef<number>(0);

  // countdown interval ref (so we can clear on unmount)
  const countdownIntervalRef = useRef<number | null>(null);

  // music
  const [userInteracted, setUserInteracted] = useState(false);
  // Add these at the top of your component (CanvasExample)
  const idleMusicRef = useRef<HTMLAudioElement | null>(null);
  const raceMusicRef = useRef<HTMLAudioElement | null>(null);
  const winnerMusicRef = useRef<HTMLAudioElement | null>(null);
  const currentMusicRef = useRef<HTMLAudioElement | null>(null);
  //tiktok
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const tiktokSocketRef = useRef<Socket | null>(null);
  // New Twitch refs
  const twitchSocketRef = useRef<any>(null);
  const [twitchConnected, setTwitchConnected] = useState(false);

  //raceduration
  const [raceDuration, setRaceDuration] = useState(120000); // default 2 minutes
  const raceDurationRef = useRef(raceDuration);

  useEffect(() => {
    raceDurationRef.current = raceDuration;
  }, [raceDuration]);

  useEffect(() => {
    // ... inside useEffect for audio loading
    idleMusicRef.current = new Audio("/music/racestart-2.mp3");
    raceMusicRef.current = new Audio("/music/race.mp3");
    winnerMusicRef.current = new Audio("/music/winnersound.mp3");

    // Add looping
    if (idleMusicRef.current) idleMusicRef.current.loop = true;
    if (raceMusicRef.current) raceMusicRef.current.loop = true;
    // winnerMusic usually doesn't loop, but set if desired:
    // if (winnerMusicRef.current) winnerMusicRef.current.loop = true;

    idleMusicRef.current.load();
    // ...
  }, []);

  // After
  const handleEnableSound = () => {
    setUserInteracted(true);
    console.log("User interaction detected, enabling sound.");

    // 1. Play and immediately pause all tracks to unlock audio (as you already do)
    const unlockAudio = async () => {
      try {
        // Use Promises to ensure unlock attempts are done
        await idleMusicRef.current
          ?.play()
          .then(() => idleMusicRef.current?.pause());
        await raceMusicRef.current
          ?.play()
          .then(() => raceMusicRef.current?.pause());
        await winnerMusicRef.current
          ?.play()
          .then(() => winnerMusicRef.current?.pause());
      } catch (error) {
        console.error("Failed to unlock audio context:", error);
      }
    };

    unlockAudio().then(() => {
      if (
        idleMusicRef.current &&
        currentMusicRef.current !== idleMusicRef.current
      ) {
        idleMusicRef.current.currentTime = 0;
        idleMusicRef.current.loop = true; // Ensure it loops if it's idle music
        idleMusicRef.current.play().catch(() => {});
        currentMusicRef.current = idleMusicRef.current;
      }
    });
  };
  const switchMusic = (next: HTMLAudioElement | null) => {
    // Stop current
    if (currentMusicRef.current) {
      currentMusicRef.current.pause();
    }

    // Start next
    if (next) {
      next.currentTime = 0;
      next.play().catch(() => {});
      currentMusicRef.current = next; // <— CRITICAL!
    }
  };
  //-------------------------------------------------------------------------------------------
  // twitch api
  // --------------------------------------------------------------------------------------------
  const connectTwitch = () => {
    if (twitchSocketRef.current) return;

    const socket = io("http://localhost:4001");
    twitchSocketRef.current = socket;

    socket.on("connect", () => {
      toast.success("✅ Connected to Twitch live server");
      setTwitchConnected(true);
    });

    socket.on("initialData", (data: { viewers: any[]; followers: any[] }) => {
      // Normalize followers
      const followersList = data.followers.map((f) =>
        typeof f === "string" ? f : f.username
      );

      // Normalize viewers
      const viewersList = data.viewers.map((v) =>
        typeof v === "string" ? v : v.username
      );

      // Combine followers + existing likes/chat
      const combinedLikers = Array.from(
        new Set([...likesRef.current, ...followersList])
      );

      likesRef.current = combinedLikers; // store all likers
      viewersRef.current = viewersList;
      rebuildDucksRef.current = true;

      setLikers(combinedLikers);
      setViewers(viewersList);
    });

    socket.on("chat", (data: { username: string; message: string }) => {
      const username = data.username;

      if (!likesRef.current.includes(username)) {
        likesRef.current = [...likesRef.current, username];
        rebuildDucksRef.current = true;
        setLikers([...likesRef.current]);
      }

      // Optionally handle chat message display
      console.log(data);
    });

    socket.on("viewerJoined", (data: { username: any; viewers: any[] }) => {
      const viewersList = data.viewers.map((v) =>
        typeof v === "string" ? v : v.username
      );
      viewersRef.current = viewersList;
      setViewers(viewersList);
    });

    socket.on("disconnect", () => {
      toast.error("⚠️ Disconnected from Twitch live server");
      setTwitchConnected(false);
    });
  };

  const disconnectTwitch = () => {
    if (twitchSocketRef.current) {
      twitchSocketRef.current.disconnect();
      twitchSocketRef.current = null;
      setTwitchConnected(false);
      console.log("Disconnected from Twitch live server");
    }
  };

  const toggleTwitchConnection = () => {
    if (twitchConnected) disconnectTwitch();
    else connectTwitch();
  };

  // -------------------------------------------------------------------------------------------
  // tiktok api
  // --------------------------------------------------------------------------------------------
  const connectTikTokLive = () => {
    if (tiktokSocketRef.current) return; // already connected

    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    tiktokSocketRef.current = socket;

    // ======================
    // CONNECT
    // ======================
    socket.on("connect", () => {
      toast.success("✅ Connected to TikTok live server");
      setTiktokConnected(true);
    });

    // ======================
    // INITIAL SNAPSHOT
    // ======================
    socket.on("initial-data", (data) => {
      likesRef.current = data.likers || [];
      viewersRef.current = data.viewers || [];

      rebuildDucksRef.current = true;

      setLikers([...likesRef.current]);
      setViewers([...viewersRef.current]);
    });

    // ======================
    // LIKE EVENT
    // ======================
    socket.on("tiktok-like", (data) => {
      if (!data?.user) return;

      if (!likesRef.current.includes(data.user)) {
        likesRef.current = [...likesRef.current, data.user];
        rebuildDucksRef.current = true;
        setLikers([...likesRef.current]);
      }
    });

    // ======================
    // CHAT EVENT
    // ======================
    socket.on("tiktok-chat", (data) => {
      // optional: if chatters count as likers
      if (data?.user && !likesRef.current.includes(data.user)) {
        likesRef.current = [...likesRef.current, data.user];
        rebuildDucksRef.current = true;
        setLikers([...likesRef.current]);
      }
    });

    // ======================
    // ROOM USER (VIEWERS)
    // ======================
    socket.on("room-user", (data) => {
      viewersRef.current = data.viewers || [];
      rebuildDucksRef.current = true;

      setViewers([...viewersRef.current]);
    });

    // ======================
    // DISCONNECT
    // ======================
    socket.on("disconnect", () => {
      toast.error("⚠️ Disconnected from TikTok live server");
      setTiktokConnected(false);
    });

    // ======================
    // OPTIONAL ERROR EVENT
    // ======================
    socket.on("tiktokError", (data) => {
      toast.error(`TikTok connection failed: ${data.message}`);
    });
  };

  const disconnectTikTokLive = () => {
    if (tiktokSocketRef.current) {
      tiktokSocketRef.current.disconnect();
      tiktokSocketRef.current = null;
      setTiktokConnected(false);
      console.log("Disconnected from TikTok live server");
    }
  };

  const toggleTikTokConnection = () => {
    if (tiktokConnected) {
      disconnectTikTokLive();
    } else {
      connectTikTokLive();
    }
  };

  // -------------------------------------------------------------------------------------------
  // Mock generator (likes + viewers) using JSON file
  // --------------------------------------------------------------------------------------------
  const startUserGenerator = () => {
    const likeNames = mockUsers.likeNames;
    const viewerNames = mockUsers.viewerNames;

    // Prevent multiple generators
    if ((window as any).mockGeneratorInterval) return;

    const likeInterval = window.setInterval(() => {
      const name = likeNames[Math.floor(Math.random() * likeNames.length)];
      setLikers((prev) => {
        if (prev.includes(name)) return prev;
        const next = [...prev, name];
        likesRef.current = next;
        rebuildDucksRef.current = true;

        if (
          next.length + viewersRef.current.length >= MIN_USERS_REQUIRED &&
          !countdownActiveRef.current
        ) {
          countdownActiveRef.current = true;
        }
        return next;
      });
    }, 2000 + Math.random() * 3000);

    const viewerInterval = window.setInterval(() => {
      const name = viewerNames[Math.floor(Math.random() * viewerNames.length)];
      setViewers((prev) => {
        let next = [...prev];

        if (Math.random() > 0.5) {
          if (!next.includes(name)) next.push(name);
        } else {
          next = next.filter((v) => v !== name);
        }

        viewersRef.current = next;
        rebuildDucksRef.current = true;

        if (
          likesRef.current.length + next.length >= MIN_USERS_REQUIRED &&
          !countdownActiveRef.current
        ) {
          countdownActiveRef.current = true;
        }
        return next;
      });
    }, 1500 + Math.random() * 2500);

    (window as any).mockGeneratorInterval = [likeInterval, viewerInterval];
  };

  const toggleUserGenerator = () => {
    const intervals = (window as any).mockGeneratorInterval;

    if (intervals) {
      // Stop generator
      intervals.forEach((id: number) => clearInterval(id));
      (window as any).mockGeneratorInterval = null;
      console.log("Mock user generator stopped");
    } else {
      // Start generator
      startUserGenerator();
      console.log("Mock user generator started");
    }
  };

  // ---------------------------
  // startCountdown (moved to component scope so mock can toggle)
  // ---------------------------
  const startCountdown = () => {
    // If an interval exists, stop it AND reset the ref
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null; // <--- THIS WAS MISSING
    }

    setCountdown(60); //--------------------------------------------------------------------countdown
    countdownRef.current = 60;
    startingLaneXRef.current = 80;

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          countdownRef.current = 0;
          return 0;
        }

        const next = prev - 1;
        countdownRef.current = next;
        return next;
      });
    }, 1000);
  };

  // ---------------------------
  // Build ducks from users (creates caches too)
  // ---------------------------
  const createDuckWithNumber = (type: Duck["type"], num: number) => {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = 150;
    offCanvas.height = 150;
    const offCtx = offCanvas.getContext("2d")!;

    switch (type) {
      case "premium1":
        duckPremiumTwo(offCtx, 0, 0, num);
        break;
      case "premium2":
        duckPremiumOne(offCtx, 0, 0, num);
        break;
      case "premium3":
        duckPremiumZero(offCtx, 0, 0, num);
        break;
      case "premium4":
        duckPremiumThree(offCtx, 0, 0, num);
        break;
      case "premium5":
        duckPremiumFour(offCtx, 0, 0, num);
        break;
      case "premium6":
        duckPremiumFive(offCtx, 0, 0, num);
        break;
      case "premium7":
        duckPremiumSix(offCtx, 0, 0, num);
        break;
      case "premium8":
        duckPremiumSeven(offCtx, 0, 0, num);
        break;
      case "premium9":
        duckPremiumEight(offCtx, 0, 0, num);
        break;
    }

    return offCanvas;
  };

  const createRegularDuckCanvas = (duck: Duck) => {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = 100;
    offCanvas.height = 100;
    const offCtx = offCanvas.getContext("2d")!;
    duckRegular(offCtx, 0, 0);
    offCtx.fillStyle = "black";
    offCtx.font = "bold 14px Arial";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(String(duck.num), 24, 39);
    return offCanvas;
  };
  const MAX_DUCKS_PER_RACE = 70; // set maximum ducks per race------------------------------------------ducksnumber

  const buildDucksFromUsers = () => {
    const likes = likesRef.current.slice(0, 15); // only up to 9 premium types--------------------------premducks
    const viewersList = viewersRef.current;

    const premiumTypes: Duck["type"][] = [
      "premium1",
      "premium2",
      "premium3",
      "premium4",
      "premium5",
      "premium6",
      "premium7",
      "premium8",
      "premium9",
    ];

    const newPremiumDucks: Duck[] = likes.map((username, i) => ({
      x: 0,
      y: 0,
      num: i + 1,
      amplitude: 4 + Math.random() * 6,
      speed: 0.3 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      type: premiumTypes[i % premiumTypes.length],
      baseX: 100,
      speedFactor: 0.9 + Math.random() * 0.05,
      boostApplied: false,
      boostDelay: Math.random() * 2000 + 1000,
      username,
    }));

    const newRegularDucks: Duck[] = viewersList.map((username, i) => ({
      x: 0,
      y: 0,
      num: newPremiumDucks.length + i + 1,
      amplitude: 4 + Math.random() * 4,
      speed: 0.3 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      type: "regular",
      baseX: 100,
      speedFactor: 0.9 + Math.random() * 0.05,
      username,
    }));

    const combined = [...newPremiumDucks, ...newRegularDucks]
      .sort(() => Math.random() - 0.5)
      .slice(0, MAX_DUCKS_PER_RACE);

    // Position ducks slope y
    const numberOfDucks = combined.length;
    const startY = 70;
    const endY = 360;
    const startX = 100;
    const slope = -0.4;
    const spacingY =
      numberOfDucks > 1 ? (endY - startY) / (numberOfDucks - 1) : 0;

    combined.forEach((d, i) => {
      d.y = startY + i * spacingY;
      d.x = startX + slope * (i * spacingY);
      d.baseX = d.x;
    });

    // Recreate caches
    const duckCache = new Map<string, HTMLCanvasElement>();
    newPremiumDucks.forEach((d) => {
      duckCache.set(`${d.type}_${d.num}`, createDuckWithNumber(d.type, d.num));
    });

    const regularDuckCache = new Map<Duck, HTMLCanvasElement>();
    newRegularDucks.forEach((d) => {
      regularDuckCache.set(d, createRegularDuckCanvas(d));
    });

    // Save to refs used in animation loop
    ducksRef.current = combined;
    duckCacheRef.current = duckCache;
    regularDuckCacheRef.current = regularDuckCache;

    // Clear winner if any and reset some race state
    winnerRef.current = null;
    raceStartTimeRef.current = 0;
    winnerDisplayStartRef.current = 0;

    // Mark that we've rebuilt ducks
    rebuildDucksRef.current = false;
  };

  const winnerAnimationRef = useRef({
    scale: 0,
    opacity: 0,
    growing: true,
    startTime: 0,
  });

  const confettiRef = useRef<
    { x: number; y: number; size: number; color: string; velocityY: number }[]
  >([]);

  const generateConfetti = () => {
    const colors = ["#ffd700", "#ff6347", "#00ffff", "#ff69b4", "#7fff00"];
    const newConfetti = [];
    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        x: Math.random() * 800,
        y: Math.random() * -300, // start above canvas
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityY: 2 + Math.random() * 3,
      });
    }
    confettiRef.current = newConfetti;
  };

  // ---------------------------
  // MAIN CANVAS EFFECT (single mount)
  // ---------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 450;

    /** Images */
    const grassImg = new Image();
    const waterImg = new Image();
    grassImg.src = "/grass.svg";
    waterImg.src = "/water.svg";

    const GRASS_HEIGHT = 111;
    const WATER_HEIGHT = 352;
    const WATER_WIDTH = 1600;
    let waterX = 0;

    // If there are initial mock users already, build ducks now
    buildDucksFromUsers();

    const FINISH_LINE = 600;
    raceDurationRef.current = raceDuration; // keep it updated whenever state changes
    const startRace = (time: number) => {
      raceStartedRef.current = true;
      raceStartTimeRef.current = time;

      // 2. Switch to the race music
      if (currentMusicRef.current !== raceMusicRef.current) {
        switchMusic(raceMusicRef.current); // play race music
        console.log("Starting race music..."); // Updated log/comment
      }
    };

    const loop = (time: number) => {
      // Rebuild ducks on-demand when mock feed changed
      if (!raceStartedRef.current && rebuildDucksRef.current) {
        buildDucksFromUsers();
      }

      const deltaTime = lastTimeRef.current ? time - lastTimeRef.current : 16;
      lastTimeRef.current = time;
      const dt = deltaTime / 16.6;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background
      if (raceStartedRef.current) {
        const grassSpeed = 0.5;
        grassXRef.current -= grassSpeed;
        if (grassXRef.current <= -1600) grassXRef.current = 0;
      }
      ctx.drawImage(grassImg, grassXRef.current, 0, 1600, GRASS_HEIGHT);
      ctx.drawImage(grassImg, grassXRef.current + 1600, 0, 1600, GRASS_HEIGHT);
      ctx.drawImage(waterImg, waterX, GRASS_HEIGHT, WATER_WIDTH, WATER_HEIGHT);
      ctx.drawImage(
        waterImg,
        waterX + WATER_WIDTH,
        GRASS_HEIGHT,
        WATER_WIDTH,
        WATER_HEIGHT
      );

      // Starting lane
      const targetX = -500;
      const laneSpeed = 3;
      if (countdownRef.current === 0 && startingLaneXRef.current > targetX) {
        startingLaneXRef.current -= laneSpeed;
        if (startingLaneXRef.current < targetX)
          startingLaneXRef.current = targetX;
      }
      startingLane(ctx, startingLaneXRef.current, 125);

      // Finish lane logic
      const resetFinishLane = () => {
        finishLaneXRef.current = 800;
        finishLaneMovedRef.current = 0;
        finishLaneDirectionRef.current = 0;
        finishLaneResetOnceRef.current = true;
      };
      if (!raceStartedRef.current) {
        if (countdownRef.current === 5 && !finishLaneResetOnceRef.current)
          resetFinishLane();
        if (countdownRef.current !== 5) finishLaneResetOnceRef.current = false;
      }

      const FINISH_LANE_MOVE_DISTANCE = 900;
      const FINISH_LANE_SPEED = 3; //-------------------------------------------------speed finish lane
      const FINISH_LANE_DELAY = 2000; //-----------------------------------------------finishlane calibrate
      const TOTAL_DISTANCE_METERS = 100;

      if (raceStartedRef.current) {
        const now = time;
        const elapsed = now - raceStartTimeRef.current;

        const distanceMeters = Math.min(
          (elapsed / raceDurationRef.current) * TOTAL_DISTANCE_METERS,
          TOTAL_DISTANCE_METERS
        );

        ctx.fillStyle = "white";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "left";

        // Show meters
        ctx.fillText(`Distance: ${distanceMeters.toFixed(1)}m`, 600, 40);
        ctx.fillText("100 meters race", 600, 70);

        if (
          elapsed >= raceDurationRef.current - FINISH_LANE_DELAY &&
          finishLaneDirectionRef.current === 0
        )
          finishLaneDirectionRef.current = -1;
        if (finishLaneDirectionRef.current === -1) {
          finishLaneXRef.current -= FINISH_LANE_SPEED;
          finishLaneMovedRef.current += FINISH_LANE_SPEED;
          if (finishLaneMovedRef.current >= FINISH_LANE_MOVE_DISTANCE)
            finishLaneDirectionRef.current = 0;
        }
      }

      FinishLane(ctx, finishLaneXRef.current, 110, 1.5);

      // Start race
      if (!raceStartedRef.current && countdownRef.current === 0)
        startRace(time);

      /** Race movement */
      if (raceStartedRef.current) {
        const now = time;
        const elapsed = now - raceStartTimeRef.current;
        const smoothing = 0.15;

        const ducks = ducksRef.current;
        let winnerLocal = winnerRef.current;

        ducks.forEach((d) => {
          if (winnerLocal && d !== winnerLocal) {
            const hideTarget = -300;
            const distance = d.x - hideTarget;
            let slide = 0.5 + Math.min(distance / 100, 1) * 1.2;
            if (d.x > hideTarget) d.x -= slide;
            else d.x = hideTarget;
            return;
          }

          // Initialize per-duck
          if (!d.speedFactor) d.speedFactor = 0.1 + Math.random() * 0.9;
          if (!d.jitterPhase) d.jitterPhase = Math.random() * 1000;
          if (!d.sprintSeed) d.sprintSeed = Math.random() * 10;
          if (!d.backwardSeed) d.backwardSeed = Math.random() * 5;
          if (d.isSprinting === undefined) d.isSprinting = false;
          if (!d.sprintStartTime) d.sprintStartTime = 0;
          if (d.boostApplied === undefined) d.boostApplied = false;
          if (!d.boostDelay) d.boostDelay = Math.random() * 2000 + 1000;

          // Smooth one-time premium boost
          if (
            d.type !== "regular" &&
            !d.boostApplied &&
            elapsed >= d.boostDelay
          ) {
            d.boostApplied = true;
            d.boostStartTime = now;
            d.boostDuration = 1500 + Math.random() * 500;
            d.boostTarget = d.x + 50 + Math.random() * 30;
          }
          if (d.boostApplied && d.boostStartTime && d.boostTarget) {
            const t = Math.min(
              (now - d.boostStartTime) / (d.boostDuration || 1),
              1
            );
            d.x += (d.boostTarget - d.x) * t;
            if (t >= 1) delete d.boostTarget;
          }

          // Sprint/backward
          if (!d.isSprinting && Math.random() < 0.001) {
            d.isSprinting = true;
            d.sprintStartTime = now;
          }
          if (d.isSprinting && now - d.sprintStartTime >= 10000)
            d.isSprinting = false;

          d.jitterPhase += 0.02;
          const sprint =
            (d.isSprinting ? 2 : 1) *
            Math.sin(elapsed / 8000 + d.sprintSeed) *
            dt;
          const backward =
            Math.sin(elapsed / 50000 + d.backwardSeed) * 0.3 * dt +
            (Math.random() < 0.002 ? 1 + Math.random() * 2 : 0);

          let targetX = d.x + sprint - backward;
          if (targetX > FINISH_LINE) targetX = FINISH_LINE - Math.random() * 5;
          d.x += (targetX - d.x) * smoothing;
        });

        // Inside your loop
        if (winnerRef.current) {
          const anim = winnerAnimationRef.current;
          if (anim.startTime === 0) anim.startTime = time;

          const elapsed = time - anim.startTime;

          // Scale: 0 → 1.2 → 1 (bounce)
          const t = Math.min(elapsed / 1000, 1); // 1 sec animation
          anim.scale = 1 + 0.2 * Math.sin(t * Math.PI);

          // Fade-in
          anim.opacity = Math.min(t, 1);

          ctx.save();
          ctx.globalAlpha = anim.opacity;
          ctx.font = `${40 * anim.scale}px Arial`;
          ctx.textAlign = "center";
          ctx.fillStyle = "white";
          ctx.fillText("🎉 Congratulations 🎉", CANVAS_WIDTH / 2, 50);
          ctx.fillText(`${winnerRef.current.username}!`, CANVAS_WIDTH / 2, 100);
          ctx.restore();

          // Fade-out after 3 seconds
          if (elapsed > 3000) {
            anim.opacity = 1 - (elapsed - 3000) / 1000; // fade out 1 sec
            if (elapsed > 4000) {
              winnerAnimationRef.current = {
                scale: 0,
                opacity: 0,
                growing: true,
                startTime: 0,
              };
            }
          }
        }

        if (confettiRef.current.length > 0) {
          confettiRef.current.forEach((c) => {
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            ctx.fill();

            // Move down
            c.y += c.velocityY;

            // Reset if out of canvas
            if (c.y > CANVAS_HEIGHT) c.y = Math.random() * -300;
          });
        }

        // End race
        if (elapsed >= raceDurationRef.current && !winnerRef.current) {
          const ducks = ducksRef.current;
          winnerRef.current = ducks.reduce((prev, curr) =>
            curr.x > prev.x ? curr : prev
          );

          winnerDisplayStartRef.current = now;
          // Initialize animation
          winnerAnimationRef.current = {
            scale: 0,
            opacity: 0,
            growing: true,
            startTime: now,
          };
          // Play winner music
          if (currentMusicRef.current !== winnerMusicRef.current) {
            switchMusic(winnerMusicRef.current);
          }

          // Generate confetti
          generateConfetti();
          if (currentMusicRef.current !== winnerMusicRef.current) {
            switchMusic(winnerMusicRef.current); // play race music
            console.log("Starting race win..."); // Updated log/comment
          }
        }

        // Reset race
        if (winnerRef.current && now - winnerDisplayStartRef.current > 10000) {
          ducksRef.current.forEach((d) => {
            d.x = d.baseX ?? 0;
            d.finished = false;
            d.speedFactor = undefined;
            d.jitterPhase = undefined;
            d.sprintSeed = undefined;
            d.backwardSeed = undefined;
            d.isSprinting = undefined;
            d.sprintStartTime = undefined;
            d.boostApplied = undefined;
            d.boostDelay = undefined;
            d.boostStartTime = undefined;
            d.boostDuration = undefined;
            d.boostTarget = undefined;
          });
          winnerRef.current = null;
          raceStartedRef.current = false;

          confettiRef.current = [];

          // rebuild ducks from the latest mock lists and start countdown for next round
          buildDucksFromUsers();
          countdownActiveRef.current = true; // allow next countdown to be triggered by mock

          if (currentMusicRef.current !== idleMusicRef.current) {
            switchMusic(idleMusicRef.current); // <--- This might override the race music
            console.log("asdasd");
          }
        }
      }

      /** Draw ducks */
      const waveOffset = time / 4000;
      const ducksToDraw = ducksRef.current;

      ducksToDraw.forEach((d) => {
        const waveY =
          d.y + Math.sin(waveOffset * d.speed + d.phase) * d.amplitude;
        if (d.type === "regular") {
          const offCanvas = regularDuckCacheRef.current.get(d);
          if (offCanvas) ctx.drawImage(offCanvas, d.x, waveY);
        } else {
          const offCanvas = duckCacheRef.current.get(`${d.type}_${d.num}`);
          if (offCanvas) ctx.drawImage(offCanvas, d.x, waveY);
        }

        // draw username above duck if present
        if (d.username) {
          if (d.type === "regular") {
            DrawUsername(ctx, d.username, d.x + 20, waveY - 10);
          } else {
            DrawUsername(ctx, d.username, d.x + 20, waveY - 2);
          }
        }
      });

      /** Move water */
      waterX -= 3;
      if (waterX <= -WATER_WIDTH) waterX = 0;

      // COUNTDOWN ACTIVE → show countdown
      if (!raceStartedRef.current && countdownActiveRef.current) {
        ctx.fillStyle = "white";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `Race starts in ${countdownRef.current}s`,
          CANVAS_WIDTH / 2,
          50
        );

        if (
          countdownActiveRef.current &&
          !raceStartedRef.current &&
          !countdownIntervalRef.current
        ) {
          startCountdown();
        }
      }

      // COUNTDOWN NOT ACTIVE + RACE NOT STARTED → show players & waiting text
      if (!raceStartedRef.current && !countdownActiveRef.current) {
        const totalUsers = likesRef.current.length + viewersRef.current.length;
        ctx.fillStyle = "red";
        ctx.font = "bold 26px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${totalUsers} / 20`, CANVAS_WIDTH / 2, 50);

        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Race start soon", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      }

      requestAnimationFrame(loop);
    };

    // Wait until waterImg loads so background draws properly.
    waterImg.onload = () => requestAnimationFrame(loop);

    // ensure we clear any countdown interval on unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      if (currentMusicRef.current) {
        currentMusicRef.current.pause();
        currentMusicRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // single mount

  return (
    <div className="w-screen relative h-screen flex flex-col p-2 bg-gray-500 overflow-hidden">
      <div className="flex justify-start items-start flex-none">
        <div className="w-full h-full flex flex-col px-4 pb-4">
          {/* Outer border container */}
          <div className="w-full h-full border-2 border-white rounded-lg overflow-hidden">
            <div className="w-full h-full flex flex-col bg-black/80 p-2 text-sm text-black shadow-2xl">
              {/* Leaderboard panel */}
              <div className="leaderboard-container flex-1 overflow-hidden mb-2">
                <div className="leaderboard">
                  {viewers.slice(-6).map((p, i) => {
                    const colorClass = colors[i % colors.length];
                    return (
                      <div
                        key={p}
                        className={`leaderboard-item ${colorClass}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <h1 className="username">{p}</h1>
                        <span className="status">is playing</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom mock lists */}
              <div className="h-[270px] pl-3 pt-4 overflow-auto">
                <p className="text-white text-center text-xl font-bold">
                  Line Up, Racers!
                </p>
                <strong className="text-white mb-2">Top Engagers</strong>
                <div className="mt-2 flex flex-wrap gap-2">
                  {likers.slice(0, 10).map((l) => (
                    <span
                      key={l}
                      style={{
                        background: "#ffd54f",
                        padding: "2px 6px",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    >
                      {l}
                    </span>
                  ))}
                  {/* One extra span at the end */}
                  {likers.length > 10 && (
                    <span
                      style={{
                        background: "#ff7043",
                        padding: "2px 6px",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    >
                      + {likers.length - 10} more
                    </span>
                  )}
                </div>

                <strong className="text-white mt-2 block">
                  Active Viewers
                </strong>
                <div className="mt-2 flex flex-wrap gap-2 overflow-auto">
                  {viewers.slice(0, 10).map((v) => (
                    <span
                      key={v}
                      style={{
                        background: "#90caf9",
                        padding: "2px 4px",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    >
                      {v}
                    </span>
                  ))}
                  {/* One extra span at the end */}
                  {viewers.length > 10 && (
                    <span
                      style={{
                        background: "#ff7043",
                        padding: "2px 6px",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    >
                      + {likers.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="border-4 border-black bg-[#378098] rounded-t"
        />
      </div>
      <div className="bg-black/70 flex justify-center rounded space-x-5 bottom-[13%] right-[1%] border-2 border-white absolute px-4 py-2 w-[50%] text-sm">
        <button
          onClick={toggleTikTokConnection}
          className="w-[30%] hover:bg-white/20 px-6 py-1 rounded-2xl bg-black border-white border-2"
        >
          {tiktokConnected ? "Disconnect TikTok API" : "Connect TikTok API"}
        </button>

        <button
          onClick={toggleTwitchConnection}
          className="w-[30%] px-6 py-1 rounded-2xl hover:bg-violet-300 bg-violet-500 border-white border-2"
        >
          {twitchConnected ? "Disconnect from Twitch" : "Connect to Twitch API"}
        </button>
        <button
          onClick={toggleUserGenerator}
          className="w-[30%] px-6 py-1 rounded-2xl hover:bg-yellow-300 bg-yellow-500 border-white border-2 "
        >
          User Generator
        </button>
      </div>
      {!userInteracted && (
        <button
          onClick={handleEnableSound}
          className="w-[150px] absolute right-[52%] border-2 border-white bottom-[15%] px-4 py-2 bg-green-500 text-white rounded"
        >
          Enable Sound
        </button>
      )}
      {/* Toast container must be in the JSX */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded">
        <label className="text-white mr-2">Race Duration (seconds):</label>
        <input
          type="number"
          value={raceDuration / 1000}
          min={10}
          max={600}
          onChange={(e) => setRaceDuration(Number(e.target.value) * 1000)}
          className="w-20 p-1 rounded text-black"
        />
      </div>
    </div>
  );
}
