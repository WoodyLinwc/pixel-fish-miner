/**
 * Rainbow rendering for rainbow weather
 */

/**
 * Draw rainbow arc across the sky
 */
export const drawRainbow = (
  ctx: CanvasRenderingContext2D,
  width: number,
  surfaceY: number,
) => {
  ctx.save();
  ctx.globalAlpha = 0.4;

  const colors = ["#f44336", "#ffeb3b", "#4caf50", "#2196f3", "#9c27b0"];
  const centerX = width / 2;
  const centerY = surfaceY + 400;
  const radiusBase = 600;

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusBase - i * 15, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 15;
    ctx.stroke();
  }

  ctx.restore();
};
