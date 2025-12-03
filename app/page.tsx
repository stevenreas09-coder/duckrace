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

    /** Ducks */
    const numberOfDucks = 50;
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
      boostApplied: false,
      boostDelay: Math.random() * 2000 + 1000, // 1-3s delay
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

    /** Duck Images */
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

    /** Race */
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
      startingLaneXRef.current = 80;

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

    /** Main loop */
    const loop = (time: number) => {
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
        const elapsed = now - raceStartTime;

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
        const elapsed = now - raceStartTime;
        const smoothing = 0.15;

        ducks.forEach((d) => {
          if (winner && d !== winner) {
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
        if (elapsed >= RACE_DURATION && !winner) {
          winner = ducks.reduce((prev, curr) =>
            curr.x > prev.x ? curr : prev
          );
          winnerDisplayStart = now;
        }

        // Reset race
        if (winner && now - winnerDisplayStart > 10000) {
          ducks.forEach((d) => {
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

      /** Countdown */
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
