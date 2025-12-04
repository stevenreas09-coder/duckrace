"use client";
import { useRef, useEffect, useState } from "react";
import { startingLane } from "./componets/lane";
import { FinishLane } from "./componets/finishlane";
import { duckRegular } from "./componets/ducks/duks";
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

  // ---------------------------
  // MOCK LIVE FEED (for testing)
  // ---------------------------
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

  // ---------------------------
  // Mock generator (likes + viewers)
  // ---------------------------
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

    const viewerNames = Array.from({ length: 30 }, (_, i) => `Viewer${i + 1}`);

    // Like generator: adds unique likes over time
    const likeInterval = window.setInterval(() => {
      const name = likeNames[Math.floor(Math.random() * likeNames.length)];
      setLikers((prev) => {
        if (prev.includes(name)) return prev;
        const next = [...prev, name];
        likesRef.current = next;
        rebuildDucksRef.current = true;
        // if enough participants and countdown not active, request countdown
        if (
          next.length + viewersRef.current.length >= MIN_USERS_REQUIRED &&
          !countdownActiveRef.current
        ) {
          countdownActiveRef.current = true;
        }
        return next;
      });
    }, 2000 + Math.random() * 3000);

    // Viewer join/leave generator
    const viewerInterval = window.setInterval(() => {
      const name = viewerNames[Math.floor(Math.random() * viewerNames.length)];
      setViewers((prev) => {
        let next = [...prev];
        if (Math.random() > 0.5) {
          // join
          if (!next.includes(name)) {
            next.push(name);
          }
        } else {
          // leave
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

    return () => {
      clearInterval(likeInterval);
      clearInterval(viewerInterval);
    };
  }, []);

  // ---------------------------
  // startCountdown (moved to component scope so mock can toggle)
  // ---------------------------
  const startCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setCountdown(5);
    countdownRef.current = 5;
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
        countdownRef.current = prev - 1;
        return prev - 1;
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

  const buildDucksFromUsers = () => {
    const likes = likesRef.current.slice(0, 9); // only up to 9 premium types
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
      type: premiumTypes[i] || "premium1",
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

    const combined = [...newPremiumDucks, ...newRegularDucks].sort(
      () => Math.random() - 0.5
    );

    // Position ducks slope y
    const numberOfDucks = 20;
    const startY = 70;
    const endY = 360;
    const startX = 100;
    const slope = -0.4;
    const spacingY = (endY - startY) / (numberOfDucks - 1);

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
    const RACE_DURATION = 120000;

    const startRace = (time: number) => {
      raceStartedRef.current = true;
      raceStartTimeRef.current = time;
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
      const laneSpeed = 1.5;
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
      const FINISH_LANE_SPEED = 3;
      const FINISH_LANE_DELAY = 3000;

      if (raceStartedRef.current) {
        const now = time;
        const elapsed = now - raceStartTimeRef.current;

        if (
          elapsed >= RACE_DURATION - FINISH_LANE_DELAY &&
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

        // End race
        if (elapsed >= RACE_DURATION && !winnerRef.current) {
          const ducks = ducksRef.current;
          winnerRef.current = ducks.reduce((prev, curr) =>
            curr.x > prev.x ? curr : prev
          );
          winnerDisplayStartRef.current = now;
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

          // rebuild ducks from the latest mock lists and start countdown for next round
          buildDucksFromUsers();
          countdownActiveRef.current = false; // allow next countdown to be triggered by mock
          startCountdown();
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
          ctx.fillStyle = "white";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(d.username, d.x + 20, waveY - 10);
        }
      });

      /** Move water */
      waterX -= 2;
      if (waterX <= -WATER_WIDTH) waterX = 0;

      /** Countdown */
      if (!raceStartedRef.current) {
        ctx.fillStyle = "white";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `Race starts in ${countdownRef.current}s`,
          CANVAS_WIDTH / 2,
          50
        );

        // If countdownActiveRef was set by mock and we haven't started countdown yet -> start it
        if (
          !raceStartedRef.current &&
          countdownActiveRef.current &&
          countdownRef.current === 60
        ) {
          startCountdown();
        }
      }

      requestAnimationFrame(loop);
    };

    // Wait until waterImg loads so background draws properly.
    waterImg.onload = () => requestAnimationFrame(loop);

    // ensure we clear any countdown interval on unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // single mount

  return (
    <div className="w-screen h-screen flex flex-col p-2 bg-gray-500 overflow-hidden">
      <div className="flex justify-end items-center flex-none">
        <div className="w-full h-[450px] px-4 pb-4">
          <div className="w-full h-full text-black bg-black/80 flex rounded text-sm shadow-2xl p-2">
            {/* Simple debug panel for mock lists */}
            <div style={{ marginTop: 8 }}>
              <strong className="text-red-500 mb-4">
                Mock Likers (premium):
              </strong>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {likers.map((l) => (
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
              </div>
              <strong
                className="text-amber-300"
                style={{ marginTop: 8, display: "block" }}
              >
                Mock Viewers:
              </strong>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {viewers.map((v) => (
                  <span
                    key={v}
                    style={{
                      background: "#90caf9",
                      padding: "2px 6px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="border-4 border-violet-500 bg-[#378098] rounded-t"
        />
      </div>

      <div className="w-full h-[280px] flex text-black gap-2 bg-gray-500 p-4">
        <div className="flex-1 rounded shadow-2xl bg-black/80">testing</div>
        <div className="flex-1 rounded shadow-2xl bg-black/80">2</div>
        <div className="flex-1 rounded shadow-2xl bg-black/80">3</div>
      </div>
    </div>
  );
}
