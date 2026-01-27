/**
 * Particle rendering
 */

import { Particle } from "./types";

/**
 * Render all particles
 */
export const renderParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
): void => {
  particles.forEach((p) => {
    ctx.fillStyle = p.color;

    if (p.type === "RAIN") {
      ctx.fillRect(p.x, p.y, 2, p.size * 3);
    } else if (p.type === "SNOW") {
      ctx.fillRect(p.x, p.y, p.size, p.size);
    } else if (p.type === "LEAF") {
      ctx.fillRect(p.x, p.y, p.size, p.size);
    } else if (p.type === "WIND_LINE") {
      ctx.fillRect(p.x, p.y, 30, 2);
    } else if (p.type === "MIST") {
      // Draw circle for mist
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "RAINBOW_SPARKLE") {
      // Diamond shape sparkle
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size, p.y);
      ctx.lineTo(p.x, p.y + p.size);
      ctx.lineTo(p.x - p.size, p.y);
      ctx.fill();
    } else if (p.type === "BUBBLE") {
      // Draw pixel bubble (Square)
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;

      // Snap to pixel grid
      const size = Math.floor(p.size);
      ctx.strokeRect(
        Math.floor(p.x - size / 2) + 0.5,
        Math.floor(p.y - size / 2) + 0.5,
        size,
        size,
      );

      // Highlight
      ctx.fillStyle = "white";
      ctx.fillRect(Math.floor(p.x) + 1, Math.floor(p.y - size / 2) + 1, 1, 1);
    } else if (p.type === "MUSIC" && p.text) {
      ctx.save();
      // Simple font for music notes, larger and bold
      ctx.font = 'bold 16px "Courier New"';
      ctx.textAlign = "center";
      // Outline for visibility
      ctx.fillStyle = "black";
      ctx.fillText(p.text, p.x + 1, p.y + 1);
      // Fill
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    }
  });
};
