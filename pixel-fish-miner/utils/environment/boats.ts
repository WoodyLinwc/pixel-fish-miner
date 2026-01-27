/**
 * Background boats rendering (parallax effect)
 */

export interface BackgroundBoat {
  x: number;
  y: number;
  vx: number;
  type: "SMALL" | "BIG";
  color: number;
  scale: number;
}

/**
 * Draw a single background boat
 */
const drawBoat = (
  ctx: CanvasRenderingContext2D,
  boat: BackgroundBoat,
  visualTime: number,
) => {
  ctx.save();
  ctx.translate(boat.x, boat.y);

  // Use stored scale for variety
  const scale = boat.scale || 0.6;
  ctx.scale(scale, scale);

  if (boat.vx < 0) ctx.scale(-1, 1); // Flip if moving left

  if (boat.type === "SMALL") {
    // Sailboat
    // Hull
    ctx.fillStyle = "#5d4037";
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(10, 6);
    ctx.lineTo(-10, 6);
    ctx.fill();
    // Mast
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(-2, -20, 2, 20);
    // Sail
    ctx.fillStyle = "#eceff1";
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, -4);
    ctx.lineTo(0, -4);
    ctx.fill();
  } else {
    // Big Ship (Cargo)
    // Hull
    ctx.fillStyle = "#37474f"; // Dark BlueGrey
    ctx.fillRect(-40, -4, 80, 10);
    ctx.fillStyle = "#b71c1c"; // Red bottom line (water line)
    ctx.fillRect(-40, 2, 80, 4);

    // Bridge
    ctx.fillStyle = "#cfd8dc"; // White/Grey upper
    ctx.fillRect(10, -14, 20, 10);
    // Windows
    ctx.fillStyle = "#263238";
    ctx.fillRect(14, -10, 12, 2);

    // Cargo Containers
    // Fixed colored containers for stability
    ctx.fillStyle = "#ef5350";
    ctx.fillRect(-20, -10, 10, 6);
    ctx.fillStyle = "#42a5f5";
    ctx.fillRect(-8, -10, 10, 6);

    // Smoke (animated)
    if (Math.floor(visualTime / 200) % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(20, -18, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
};

/**
 * Draw all background boats
 */
export const drawBackgroundBoats = (
  ctx: CanvasRenderingContext2D,
  boats: BackgroundBoat[],
  visualTime: number,
) => {
  boats.forEach((boat) => {
    drawBoat(ctx, boat, visualTime);
  });
};
