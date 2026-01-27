/**
 * Lamp rendering for the boat
 */

/**
 * Draw the lamp structure
 */
export const drawLamp = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  boatY: number,
  isOn: boolean,
) => {
  ctx.save();

  // Bracket/Support connecting to boat
  ctx.fillStyle = "#4e342e"; // Dark wood
  ctx.fillRect(x + 2, boatY + 2, 16, 4); // Horizontal arm attaching to hull

  // Post/Housing vertical line
  ctx.fillStyle = "#3e2723";
  ctx.fillRect(x, y, 4, 30);

  // Lantern Housing
  ctx.fillStyle = "#263238";
  ctx.fillRect(x - 3, y, 10, 2); // Top lid
  ctx.fillRect(x - 2, y + 12, 8, 2); // Bottom base

  // Lantern Glass
  ctx.fillStyle = isOn ? "#ffeb3b" : "#90a4ae";
  ctx.fillRect(x - 2, y + 2, 8, 10);

  // Handle ring
  ctx.strokeStyle = "#263238";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 2, y - 2, 3, Math.PI, 0);
  ctx.stroke();

  ctx.restore();
};

/**
 * Draw the lamp's glow effect (rendered after darkness overlay)
 */
export const drawLampGlow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
) => {
  ctx.save();
  const glowX = x + 2;
  const glowY = y + 7;

  // Warm glow gradient
  const gradient = ctx.createRadialGradient(glowX, glowY, 2, glowX, glowY, 150);
  gradient.addColorStop(0, "rgba(255, 235, 59, 0.5)"); // Bright core
  gradient.addColorStop(0.1, "rgba(255, 235, 59, 0.2)"); // Soft Halo
  gradient.addColorStop(1, "rgba(255, 235, 59, 0)"); // Transparent

  ctx.fillStyle = gradient;
  // Draw glow as a large circle
  ctx.beginPath();
  ctx.arc(glowX, glowY, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};
