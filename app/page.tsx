"use client";
import { useRef, useEffect } from "react";
import { startingLane } from "./componets/lane";
import { duckRegular } from "./componets/ducks/duks";
import {
  duckPremiumTwo,
  duckPremiumOne,
  duckPremiumoZero,
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
};

export default function CanvasExample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const grassImg = new Image();
    const waterImg = new Image();

    grassImg.src = "/grass.svg";
    waterImg.src = "/water.svg";

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 450;
    const GRASS_HEIGHT = 111;
    const WATER_HEIGHT = 352;

    // --- Ducks Configuration ---
    const numberOfDucks = 10; // total ducks
    const startY = 70;
    const endY = 370;
    const startX = 100;
    const slope = -0.4;
    const spacingY = (endY - startY) / (numberOfDucks - 1);

    // Example: list of player-selected premium ducks
    const premiumDucksSelected: Duck["type"][] = [
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

    // Create premium duck objects
    const premiumDucks: Duck[] = premiumDucksSelected.map((type, i) => ({
      y: 0,
      x: 0,
      num: i + 1,
      amplitude: 5 + Math.random() * 5,
      speed: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
      type,
    }));

    // Create remaining regular ducks
    const regularDucks: Duck[] = Array.from(
      { length: numberOfDucks - premiumDucks.length },
      (_, i) => ({
        y: 0,
        x: 0,
        num: premiumDucks.length + i + 1,
        amplitude: 5 + Math.random() * 5,
        speed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        type: "regular",
      })
    );

    // Combine and shuffle for random placement
    const ducks: Duck[] = [...premiumDucks, ...regularDucks].sort(
      () => Math.random() - 0.5
    );

    // Assign final Y/X positions for all ducks
    ducks.forEach((d, i) => {
      d.y = startY + i * spacingY;
      d.x = startX + slope * (i * spacingY);
    });

    const WATER_WIDTH = 1600;
    let waterX = 0;

    const loop = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw grass
      ctx.drawImage(grassImg, 0, 0, 1600, GRASS_HEIGHT);

      // Draw water (looped)
      ctx.drawImage(waterImg, waterX, GRASS_HEIGHT, WATER_WIDTH, WATER_HEIGHT);
      ctx.drawImage(
        waterImg,
        waterX + WATER_WIDTH,
        GRASS_HEIGHT,
        WATER_WIDTH,
        WATER_HEIGHT
      );

      startingLane(ctx);

      // Draw ducks with wave motion
      ducks.forEach((d) => {
        const waveY =
          d.y + Math.sin((Date.now() / 50) * d.speed + d.phase) * d.amplitude;

        switch (d.type) {
          case "regular":
            duckRegular(ctx, d.x, waveY, d.num);
            break;
          case "premium1":
            duckPremiumTwo(ctx, d.x, waveY, d.num);
            break;
          case "premium2":
            duckPremiumOne(ctx, d.x, waveY, d.num);
            break;
          case "premium3":
            duckPremiumoZero(ctx, d.x, waveY, d.num);
            break;
          case "premium4":
            duckPremiumThree(ctx, d.x, waveY, d.num);
            break;
          case "premium5":
            duckPremiumFour(ctx, d.x, waveY, d.num);
            break;
          case "premium6":
            duckPremiumFive(ctx, d.x, waveY, d.num);
            break;
          case "premium7":
            duckPremiumSix(ctx, d.x, waveY, d.num);
            break;
          case "premium8":
            duckPremiumSeven(ctx, d.x, waveY, d.num);
            break;
          case "premium9":
            duckPremiumEight(ctx, d.x, waveY, d.num);
            break;
        }
      });

      // Move water
      waterX -= 2;
      if (waterX <= -WATER_WIDTH) waterX = 0;

      requestAnimationFrame(loop);
    };

    waterImg.onload = () => loop();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col p-2 bg-white overflow-hidden">
      {/* Canvas Game Area */}
      <div className="flex justify-end items-center flex-none">
        <div className="w-full h-[450px] px-4 pb-4">
          <div className="w-full h-full text-black bg-white rounded shadow-2xl">
            Leaderboard
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="border-2 bg-[#378098] rounded-t"
        />
      </div>

      {/* Leaderboard / Footer */}
      <div className="w-full h-[280px] flex text-black gap-2 bg-white p-4">
        <div className="flex-1 rounded shadow-2xl bg-white">1</div>
        <div className="flex-1 rounded shadow-2xl bg-white">2</div>
        <div className="flex-1 rounded shadow-2xl bg-white">3</div>
      </div>
    </div>
  );
}
