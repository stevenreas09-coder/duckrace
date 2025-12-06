export function DrawUsername(
  ctx: CanvasRenderingContext2D,
  username: string,
  x: number,
  y: number
) {
  ctx.save(); // Save default canvas state (no shadow)

  // --- Text styles ---
  ctx.font = "bold 12px Verdana";
  ctx.textAlign = "center";

  // --- Shadow effect (only for username) ---
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // --- Outline ---
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";

  // --- Fill ---
  ctx.fillStyle = "white";

  // Draw shadow outline then fill
  ctx.strokeText(username, x, y);
  ctx.fillText(username, x, y);

  ctx.restore(); // Remove shadow + reset canvas styles
}
