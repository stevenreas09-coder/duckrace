"use client";
import { useRef, useEffect } from "react";
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
};

export default function CanvasExample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 450;

    // --- Images ---
    const grassImg = new Image();
    const waterImg = new Image();
    grassImg.src = "/grass.svg";
    waterImg.src = "/water.svg";

    const GRASS_HEIGHT = 111;
    const WATER_HEIGHT = 352;
    const WATER_WIDTH = 1600;
    let waterX = 0;

    // --- Ducks Config ---
    const numberOfDucks = 10;
    const startY = 70;
    const endY = 370;
    const startX = 100;
    const slope = -0.4;
    const spacingY = (endY - startY) / (numberOfDucks - 1);

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

    const premiumDucks: Duck[] = premiumDucksSelected.map((type, i) => ({
      y: 0,
      x: 0,
      num: i + 1,
      amplitude: 4 + Math.random() * 6,
      speed: 0.3 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      type,
    }));

    const regularDucks: Duck[] = Array.from(
      { length: numberOfDucks - premiumDucks.length },
      (_, i) => ({
        y: 0,
        x: 0,
        num: premiumDucks.length + i + 1,
        amplitude: 4 + Math.random() * 4,
        speed: 0.3 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        type: "regular",
      })
    );

    const ducks: Duck[] = [...premiumDucks, ...regularDucks].sort(
      () => Math.random() - 0.5
    );

    ducks.forEach((d, i) => {
      d.y = startY + i * spacingY;
      d.x = startX + slope * (i * spacingY);
    });

    // --- Pre-render premium ducks with numbers ---
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

    ducks.forEach((d) => {
      if (d.type !== "regular") {
        duckCache.set(
          `${d.type}_${d.num}`,
          createDuckWithNumber(d.type, d.num)
        );
      }
    });

    // --- Pre-render regular ducks with numbers ---
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

    // --- Animation Loop ---
    const loop = (time: number) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw grass and water
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

      ducks.forEach((d) => {
        const waveY =
          d.y + Math.sin((time / 2000) * d.speed + d.phase) * d.amplitude;

        if (d.type === "regular") {
          const offCanvas = regularDuckCache.get(d);
          if (offCanvas) ctx.drawImage(offCanvas, d.x, waveY);
        } else {
          const offCanvas = duckCache.get(`${d.type}_${d.num}`);
          if (offCanvas) ctx.drawImage(offCanvas, d.x, waveY);
        }
      });

      // Move water
      waterX -= 2;
      if (waterX <= -WATER_WIDTH) waterX = 0;

      requestAnimationFrame(loop);
    };

    waterImg.onload = () => requestAnimationFrame(loop);
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
