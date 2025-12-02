"use client";
import { useRef, useEffect, useState } from "react";
import { startingLane } from "./componets/lane";
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
import LiveFeedTesting from "./api/component/liveFeedsTesting";

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
  jitterPhase?: number; // ← Add this line
  sprintSeed?: number;
  backwardSeed?: number;
  isSprinting?: boolean; // new: flag for sprint state
  sprintStartTime?: number; // new: when sprint started
};

export default function CanvasExample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [countdown, setCountdown] = useState(60);
  const countdownRef = useRef(countdown);
  countdownRef.current = countdown;

  const raceStartedRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 450;

    /** --------------------------
     *  IMAGES
     * --------------------------- */
    const grassImg = new Image();
    const waterImg = new Image();
    grassImg.src = "/grass.svg";
    waterImg.src = "/water.svg";

    const GRASS_HEIGHT = 111;
    const WATER_HEIGHT = 352;
    const WATER_WIDTH = 1600;
    let waterX = 0;

    /** --------------------------
     *  DUCK GENERATION
     * --------------------------- */

    const numberOfDucks = 20;
    const startY = 70;
    const endY = 370;
    const startX = 100;
    const slope = -0.4;
    const spacingY = (endY - startY) / (numberOfDucks - 1);

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

    const premiumDucks: Duck[] = premiumTypes.map((type, i) => ({
      x: 0,
      y: 0,
      num: i + 1,
      amplitude: 4 + Math.random() * 6,
      speed: 0.3 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      type,
      speedFactor: 0.9 + Math.random() * 0.05,
    }));

    const regularDucks: Duck[] = Array.from(
      { length: numberOfDucks - premiumDucks.length },
      (_, i) => ({
        x: 0,
        y: 0,
        num: premiumDucks.length + i + 1,
        amplitude: 4 + Math.random() * 4,
        speed: 0.3 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        type: "regular",
        speedFactor: 0.9 + Math.random() * 0.05,
      })
    );

    const ducks: Duck[] = [...premiumDucks, ...regularDucks].sort(
      () => Math.random() - 0.5
    );

    ducks.forEach((d, i) => {
      d.y = startY + i * spacingY;
      d.x = startX + slope * (i * spacingY);
      d.baseX = d.x;
    });

    /** --------------------------
     *  CACHE DUCK IMAGES
     * --------------------------- */

    const duckCache = new Map<string, HTMLCanvasElement>();

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

    premiumDucks.forEach((d) => {
      duckCache.set(`${d.type}_${d.num}`, createDuckWithNumber(d.type, d.num));
    });

    const regularDuckCache = new Map<Duck, HTMLCanvasElement>();
    regularDucks.forEach((duck) => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 100;
      offCanvas.height = 100;
      const offCtx = offCanvas.getContext("2d")!;
      duckRegular(offCtx, 0, 0);

      offCtx.fillStyle = "black";
      offCtx.font = "bold 14px Arial";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(duck.num.toString(), 24, 39);

      regularDuckCache.set(duck, offCanvas);
    });

    /** --------------------------
     *  RACE LOGIC
     * --------------------------- */

    const FINISH_LINE = 600;
    const RACE_DURATION = 60000;
    let raceStartTime = 0;
    let winner: Duck | null = null;
    let winnerDisplayStart = 0;

    const startRace = (time: number) => {
      raceStartedRef.current = true;
      raceStartTime = time;
    };

    let countdownInterval: number;

    const startCountdown = () => {
      clearInterval(countdownInterval);
      setCountdown(5);

      countdownInterval = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    startCountdown();

    /** --------------------------
     *  MAIN LOOP
     * --------------------------- */

    const loop = (time: number) => {
      const deltaTime = lastTimeRef.current ? time - lastTimeRef.current : 16;
      lastTimeRef.current = time;
      const dt = deltaTime / 16.6; // normalize to ~60fps

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      /** Background */
      ctx.drawImage(grassImg, 0, 0, 1600, GRASS_HEIGHT);
      ctx.drawImage(waterImg, waterX, GRASS_HEIGHT, WATER_WIDTH, WATER_HEIGHT);
      ctx.drawImage(
        waterImg,
        waterX + WATER_WIDTH,
        GRASS_HEIGHT,
        WATER_WIDTH,
        WATER_HEIGHT
      );

      startingLane(ctx);

      /** Start race after countdown */
      if (!raceStartedRef.current && countdownRef.current === 0) {
        startRace(time);
      }

      /** --------------------------
       *  RACE MOVEMENT (UPDATED)
       * --------------------------- */
      if (raceStartedRef.current) {
        const now = time;
        const elapsed = now - raceStartTime;
        const p = Math.min(elapsed / RACE_DURATION, 1);
        const FINISH_DISTANCE = FINISH_LINE;
        const smoothing = 0.15; // increased for smoother movement

        ducks.forEach((d, i) => {
          if (winner && d !== winner) {
            d.x = -200; // hide non-winning ducks
            return;
          }

          // Initialize per-duck parameters (only once per race)
          if (d.speedFactor === undefined)
            d.speedFactor = 0.1 + Math.random() * 0.9; // wider range for more variation
          if (d.jitterPhase === undefined) d.jitterPhase = Math.random() * 1000;
          if (d.sprintSeed === undefined) d.sprintSeed = Math.random() * 10;
          if (d.backwardSeed === undefined) d.backwardSeed = Math.random() * 5;
          if (d.isSprinting === undefined) d.isSprinting = false; // initialize sprint flag
          if (d.sprintStartTime === undefined) d.sprintStartTime = 0; // initialize start time

          // Handle sprint logic
          if (!d.isSprinting && Math.random() < 0.001) {
            // ~0.05% chance per frame to start sprint (adjust for frequency)
            d.isSprinting = true;
            d.sprintStartTime = now;
          }
          if (d.isSprinting && now - d.sprintStartTime >= 10000) {
            // 10 seconds
            d.isSprinting = false;
          }

          // Base forward movement (boosted during sprint)
          let baseForward = d.speedFactor * 0.5 * dt;
          if (d.isSprinting) {
            baseForward *= 3; // 3x speed during sprint
          }

          // Smooth vertical bobbing (unchanged)
          d.jitterPhase += 0.02;
          const jitter = Math.sin(d.jitterPhase) * 0.1 * dt;

          // Sprint burst: sinusoidal base + random unexpected sprints
          const baseSprint = Math.sin(elapsed / 4000 + d.sprintSeed) * 1.5 * dt;
          const randomSprint =
            Math.random() < 0.003 ? (2 + Math.random() * 3) * dt : 0; // rare, strong sprints
          const sprint = baseSprint + randomSprint;

          // Small backward movement (occasional stronger pushes for gaps)
          const baseBackward =
            Math.sin(elapsed / 5000 + d.backwardSeed) * 0.3 * dt;
          const randomBackward =
            Math.random() < 0.002 ? (1 + Math.random() * 2) * dt : 0; // rare backward surges
          const backward = baseBackward + randomBackward;

          // Target position (allows ducks to move backward, creating gaps and off-screen movement)
          let targetX = d.x + baseForward + sprint - backward;

          // Apply low-pass filter for smooth movement
          d.x += (targetX - d.x) * smoothing;

          // No clamping: allows ducks to create gaps, overtake, and move off-screen (negative x)
          // Ducks can naturally fall behind or sprint ahead

          // Detect winner (first to reach finish)
          if (!winner && d.x >= FINISH_DISTANCE) {
            winner = d;
            winnerDisplayStart = now;
          }
        });

        // End race if time is up and no winner yet (declare closest duck as winner)
        if (elapsed >= RACE_DURATION && !winner) {
          winner = ducks.reduce((prev, curr) =>
            curr.x > prev.x ? curr : prev
          );
          winnerDisplayStart = now;
        }

        // Reset race after showing winner
        if (winner && now - winnerDisplayStart > 10000) {
          ducks.forEach((d) => {
            d.x = d.baseX ?? 0;
            d.finished = false;
            d.speedFactor = undefined;
            d.jitterPhase = undefined;
            d.sprintSeed = undefined;
            d.backwardSeed = undefined;
            d.isSprinting = undefined; // reset sprint flag
            d.sprintStartTime = undefined; // reset start time
          });
          winner = null;
          raceStartedRef.current = false;
          startCountdown();
        }
      }

      /** Draw ducks */
      const waveOffset = time / 4000;

      ducks.forEach((d) => {
        const waveY =
          d.y + Math.sin(waveOffset * d.speed + d.phase) * d.amplitude;

        if (d.type === "regular") {
          const offCanvas = regularDuckCache.get(d);
          if (offCanvas) ctx.drawImage(offCanvas, d.x, waveY);
        } else {
          const offCanvas = duckCache.get(`${d.type}_${d.num}`);
          if (offCanvas) ctx.drawImage(offCanvas, d.x, waveY);
        }
      });

      /** Move water */
      waterX -= 2;
      if (waterX <= -WATER_WIDTH) waterX = 0;

      /** Countdown text */
      if (!raceStartedRef.current) {
        ctx.fillStyle = "red";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `Race starts in ${countdownRef.current}s`,
          CANVAS_WIDTH / 2,
          50
        );
      }

      requestAnimationFrame(loop);
    };

    waterImg.onload = () => requestAnimationFrame(loop);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col p-2 bg-white overflow-hidden">
      <div className="flex justify-end items-center flex-none">
        <div className="w-full h-[450px] px-4 pb-4">
          <div className="w-full h-full text-black bg-white rounded text-sm shadow-2xl p-2">
            <LiveFeedTesting />
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="border-2 bg-[#378098] rounded-t"
        />
      </div>

      <div className="w-full h-[280px] flex text-black gap-2 bg-white p-4">
        <div className="flex-1 rounded shadow-2xl bg-white">testing</div>
        <div className="flex-1 rounded shadow-2xl bg-white">2</div>
        <div className="flex-1 rounded shadow-2xl bg-white">3</div>
      </div>
    </div>
  );
}
