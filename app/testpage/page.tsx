"use client";

import { useRef, useEffect } from "react";

interface WaveTextProps {
  text?: string; // optional, defaults to "Hello World"
  fontSize?: number;
  speed?: number; // horizontal speed in px/frame
  waveAmplitude?: number; // vertical wave height
  waveFrequency?: number; // wave density
  color?: string;
  height?: number;
}

export function WaveText({
  text = "Hello World",
  fontSize = 40,
  speed = 2,
  waveAmplitude = 20,
  waveFrequency = 0.1,
  color = "white",
  height = 150,
}: WaveTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // canvas not mounted yet
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // 2d context not available

    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = height;
    let width = canvas.width;

    let offsetX = 0;
    let waveOffset = 0;

    const animate = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";

      // Draw each letter with wave motion
      for (let i = 0; i < text.length; i++) {
        const x = offsetX + i * fontSize * 0.6;
        const y =
          height / 2 + Math.sin(waveOffset + i * waveFrequency) * waveAmplitude;
        ctx.fillText(text[i], x, y);
      }

      offsetX += speed;
      waveOffset += 0.1;

      // Loop text when it moves off-screen
      if (offsetX > width) offsetX = -text.length * fontSize * 0.6;

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize safely
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = height;
        width = canvasRef.current.width;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [text, fontSize, speed, waveAmplitude, waveFrequency, color, height]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-black absolute top-0 right-0"
      style={{ display: "block" }}
    />
  );
}
