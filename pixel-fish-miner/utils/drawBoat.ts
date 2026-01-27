/**
 * Player boat rendering
 */

/**
 * Draw the main fishing boat
 */
export const drawBoat = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  ctx.save();

  // Main hull
  ctx.fillStyle = "#5d4037";
  ctx.fillRect(x, y, width, height);

  // Deck planks (detail lines)
  ctx.fillStyle = "#4e342e";
  ctx.fillRect(x, y + 10, width, 2);
  ctx.fillRect(x, y + 20, width, 2);

  // Rails/trim
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(x + 10, y - 10, width - 20, 5); // Top rail
  ctx.fillRect(x + 10, y - 10, 5, 10); // Left post
  ctx.fillRect(x + width - 15, y - 10, 5, 10); // Right post

  ctx.restore();
};
