/**
 * Floating text rendering system
 */

import { FloatingText } from "../../types";

/**
 * Draw all floating text messages with outline effect
 */
export const drawFloatingTexts = (
  ctx: CanvasRenderingContext2D,
  floatingTexts: FloatingText[],
) => {
  floatingTexts.forEach((t) => {
    ctx.save();

    // Use life as alpha if it's decaying (<1), but if it's holding (>1), keep it 1.0
    ctx.globalAlpha = Math.min(1.0, t.life);

    // Use thinner text (removed bold)
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = "left";

    // 8-way outline manually for pixel perfection at small sizes
    // This is much cleaner than strokeText which eats into the font
    ctx.fillStyle = "black";
    ctx.fillText(t.text, t.x - 1, t.y - 1);
    ctx.fillText(t.text, t.x + 1, t.y - 1);
    ctx.fillText(t.text, t.x - 1, t.y + 1);
    ctx.fillText(t.text, t.x + 1, t.y + 1);

    // Main text on top
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);

    ctx.restore();
  });
};
