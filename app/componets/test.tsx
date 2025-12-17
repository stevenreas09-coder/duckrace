"use client";

import { useRef, useEffect } from "react";

export default function DuckCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawDuck = (
    ctx: CanvasRenderingContext2D,
    x = 0, // move left/right
    y = 111, // move up/down
    size = 1 // scale size
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);

    ctx.save();

    // your original internal transforms
    ctx.scale(0.1, 0.1);
    ctx.scale(6.25, 6.25);
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    ctx.font = "15px ''";

    // 👉 Put ALL your draw code here
    // (FROM: ctx.save(); var g = ctx.createLinearGradient... UNTIL the last ctx.restore())
    // Remove: "var SVGIcons = {}" and "Q.registerImage"

    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    ctx.font = "15px ''";
    ctx.font = "   15px ''";
    ctx.scale(0.1, 0.1);
    ctx.scale(16.3265306122449, 16.3265306122449);
    ctx.save();
    ctx.font = "   15px ''";
    ctx.save();
    ctx.fillStyle = "#F6C346";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(37.19, 26.375);
    ctx.bezierCurveTo(
      36.190999999999995,
      24.392,
      34.704,
      22.557,
      32.503,
      21.256
    );
    ctx.bezierCurveTo(32.272, 21.12, 32.208, 20.82, 32.38, 20.615000000000002);
    ctx.bezierCurveTo(
      33.496,
      19.283,
      37.049,
      14.747000000000002,
      37.049,
      11.000000000000002
    );
    ctx.bezierCurveTo(
      37.049,
      4.925000000000002,
      32.124,
      1.7763568394002505e-15,
      26.049,
      1.7763568394002505e-15
    );
    ctx.bezierCurveTo(
      19.973999999999997,
      1.7763568394002505e-15,
      15.049,
      4.925000000000002,
      15.049,
      11.000000000000002
    );
    ctx.bezierCurveTo(
      15.049,
      17,
      20.057,
      20.048000000000002,
      20.922,
      20.880000000000003
    );
    ctx.bezierCurveTo(
      21.008,
      20.962000000000003,
      21.052,
      21.066000000000003,
      21.05,
      21.185000000000002
    );
    ctx.bezierCurveTo(
      21.038,
      22.200000000000003,
      20.708000000000002,
      26.979000000000003,
      15.518,
      25.17
    );
    ctx.bezierCurveTo(
      14.120000000000001,
      24.683000000000003,
      12.878,
      23.829,
      11.832,
      22.783
    );
    ctx.lineTo(5.888, 16.84);
    ctx.bezierCurveTo(5.419, 16.371, 4.649, 16.431, 4.254, 16.965);
    ctx.bezierCurveTo(2.92, 18.768, 0.431, 23.017, 1.048, 29);
    ctx.bezierCurveTo(
      1.048,
      29,
      1.4140000000000001,
      45.187,
      12.652,
      48.513999999999996
    );
    ctx.bezierCurveTo(13.861, 48.872, 15.126, 49, 16.386, 49);
    ctx.lineTo(23.244, 49);
    ctx.bezierCurveTo(26.098, 49, 28.889, 48.171, 31.271, 46.598);
    ctx.bezierCurveTo(31.354, 46.543, 31.437, 46.488, 31.521, 46.432);
    ctx.bezierCurveTo(38.085, 42.017, 40.75, 33.439, 37.19, 26.375);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#D77328";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(47.538, 10);
    ctx.lineTo(39.331999999999994, 10);
    ctx.lineTo(36.99699999999999, 10);
    ctx.bezierCurveTo(
      37.026999999999994,
      10.33,
      37.04699999999999,
      10.662,
      37.04699999999999,
      11
    );
    ctx.bezierCurveTo(
      37.04699999999999,
      13.350999999999999,
      35.64899999999999,
      16.011,
      34.33099999999999,
      17.997
    );
    ctx.lineTo(34.33099999999999, 18);
    ctx.lineTo(40.20199999999999, 18);
    ctx.bezierCurveTo(
      41.12799999999999,
      18,
      42.05599999999999,
      17.782,
      42.83399999999999,
      17.279
    );
    ctx.bezierCurveTo(
      45.40199999999999,
      15.621,
      47.26799999999999,
      12.215,
      47.99499999999999,
      10.725
    );
    ctx.bezierCurveTo(48.161, 10.389, 47.912, 10, 47.538, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.arc(28.048, 9, 4, 0, 6.283185307179586, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#2C2F38";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.arc(30.048, 10, 2, 0, 6.283185307179586, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#D77328";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(20.515, 29.887);
    ctx.bezierCurveTo(
      27.238,
      26.474,
      28.048000000000002,
      34.012,
      28.048000000000002,
      34.012
    );
    ctx.bezierCurveTo(
      28.048000000000002,
      42.762,
      21.048000000000002,
      42.012,
      21.048000000000002,
      42.012
    );
    ctx.bezierCurveTo(
      15.101000000000003,
      42.012,
      12.115000000000002,
      35.743,
      11.290000000000003,
      33.669
    );
    ctx.bezierCurveTo(
      11.152000000000003,
      33.323,
      11.361000000000002,
      32.942,
      11.724000000000002,
      32.861
    );
    ctx.lineTo(12.101000000000003, 32.776999999999994);
    ctx.bezierCurveTo(15.006, 32.132, 17.863, 31.233, 20.515, 29.887);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.restore();
  };

  /* -------------------------
       PASTE YOUR FULL DUCK PATH
       ------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawDuck(ctx);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="border border-gray-400 rounded"
    />
  );
}
