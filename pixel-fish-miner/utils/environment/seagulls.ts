/**
 * Seagull rendering with flapping animation
 */

export interface Seagull {
  x: number;
  y: number;
  vx: number;
  flapTimer: number;
  flapState: number;
}

/**
 * Draw a single seagull with flapping animation
 */
export const drawSeagull = (
  ctx: CanvasRenderingContext2D,
  seagull: Seagull,
) => {
  const { x, y, vx, flapState } = seagull;
  const facingRight = vx > 0;

  ctx.save();
  ctx.translate(x, y);
  if (!facingRight) ctx.scale(-1, 1);

  // Body
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-5, -2, 12, 5);

  // Tail
  ctx.fillStyle = "#cfd8dc";
  ctx.fillRect(-8, 0, 3, 2);

  // Head area
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(5, -5, 5, 5);

  // Beak
  ctx.fillStyle = "#ffb74d";
  ctx.fillRect(9, -2, 3, 2);

  // Eye
  ctx.fillStyle = "#263238";
  ctx.fillRect(7, -4, 1, 1);

  // Wings (Greyish) - Animation states
  ctx.fillStyle = "#e0e0e0";
  const state = flapState % 4; // 0: Up, 1: Mid, 2: Down, 3: Mid

  if (state === 0) {
    // Up
    ctx.fillRect(-2, -8, 6, 6); // Wing up
  } else if (state === 1 || state === 3) {
    // Mid
    ctx.fillRect(-2, -1, 8, 3);
  } else {
    // Down
    ctx.fillRect(-2, 1, 6, 5);
  }

  ctx.restore();
};

/**
 * Draw all seagulls
 */
export const drawSeagulls = (
  ctx: CanvasRenderingContext2D,
  seagulls: Seagull[],
) => {
  seagulls.forEach((seagull) => {
    drawSeagull(ctx, seagull);
  });
};
