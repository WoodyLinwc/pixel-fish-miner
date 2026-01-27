/**
 * Sailor Costume
 * Features striped Breton shirt, blue pants, and sailor cap with anchor
 */
export const drawSailorCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (Blue jeans/denim)
  ctx.fillStyle = "#1976d2"; // Bright blue pants
  ctx.fillRect(0, -20, 8, 20);
  ctx.fillRect(12, -20, 8, 20);

  // Torso (White shirt with blue horizontal stripes - Breton style)
  ctx.fillStyle = "#ffffff"; // White base
  ctx.fillRect(-2, -45, 24, 25);

  // Blue horizontal stripes
  ctx.fillStyle = "#1565c0"; // Navy blue stripes
  ctx.fillRect(-2, -43, 24, 3); // Stripe 1
  ctx.fillRect(-2, -37, 24, 3); // Stripe 2
  ctx.fillRect(-2, -31, 24, 3); // Stripe 3
  ctx.fillRect(-2, -25, 24, 3); // Stripe 4

  // Arms (White sleeves with stripes)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-6, -42, 6, 20);
  ctx.fillRect(20, -42, 6, 20);
  // Blue stripes on arms
  ctx.fillStyle = "#1565c0";
  ctx.fillRect(-6, -40, 6, 2);
  ctx.fillRect(-6, -34, 6, 2);
  ctx.fillRect(20, -40, 6, 2);
  ctx.fillRect(20, -34, 6, 2);
  // Hands
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(-6, -22, 6, 4);
  ctx.fillRect(20, -22, 6, 4);

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Sailor Cap (White round cap with blue band)
  ctx.fillStyle = "#ffffff"; // White cap top (round/flat style)
  ctx.fillRect(0, -64, 20, 8); // Main cap
  ctx.fillStyle = "#1565c0"; // Blue band
  ctx.fillRect(0, -58, 20, 3); // Band around bottom
  // Cap badge/anchor detail
  ctx.fillStyle = "#ffca28"; // Gold anchor
  ctx.fillRect(9, -62, 2, 4); // Anchor vertical
  ctx.fillRect(7, -60, 6, 2); // Anchor horizontal
};
