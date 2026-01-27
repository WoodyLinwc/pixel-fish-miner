/**
 * Crane/winch rendering for the boat
 */

/**
 * Draw the crane mechanism with powerup indicators
 */
export const drawCrane = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  clawY: number,
  surfaceY: number,
  isMultiClawActive: boolean,
  isDiamondHookActive: boolean,
  isSuperNetActive: boolean,
) => {
  ctx.save();

  // Main vertical post
  ctx.fillStyle = "#455a64";
  ctx.fillRect(centerX - 8, clawY - 10, 16, surfaceY - clawY + 10);

  // Powerup gear indicators (stacked)
  if (isMultiClawActive) {
    ctx.fillStyle = "#2196f3"; // Blue gear indicator
    ctx.fillRect(centerX - 12, clawY - 15, 24, 6);
  }

  if (isDiamondHookActive) {
    ctx.fillStyle = "#ab47bc"; // Purple gear indicator
    ctx.fillRect(centerX - 14, clawY - 18, 28, 4);
  }

  if (isSuperNetActive) {
    ctx.fillStyle = "#4caf50"; // Green gear indicator
    ctx.fillRect(centerX - 16, clawY - 21, 32, 4);
  }

  // Winch mechanism (main hub)
  ctx.fillStyle = "#263238";
  ctx.beginPath();
  ctx.arc(centerX, clawY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Inner winch detail
  ctx.fillStyle = "#546e7a";
  ctx.beginPath();
  ctx.arc(centerX, clawY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};
