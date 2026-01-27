/**
 * Combo display rendering
 */

/**
 * Draw combo counter with pulsating animation and color scaling
 */
export const drawCombo = (
  ctx: CanvasRenderingContext2D,
  combo: number,
  visualTime: number,
  x: number,
  y: number,
) => {
  // Only show combo if 3 or higher
  if (combo < 3) return;

  ctx.save();

  // Pulsating Scale
  const scale = 1 + Math.sin(visualTime * 0.01) * 0.1;
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.font = 'bold 14px "Press Start 2P"';
  ctx.textAlign = "center";
  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 4;

  // Colors shift based on combo height
  let comboColor = "#ffeb3b"; // Yellow
  if (combo >= 10) comboColor = "#ff9800"; // Orange
  if (combo >= 50) comboColor = "#f44336"; // Red
  if (combo >= 100) comboColor = "#e040fb"; // Purple

  const text = `COMBO x${combo}`;
  ctx.strokeText(text, 0, 0);
  ctx.fillStyle = comboColor;
  ctx.fillText(text, 0, 0);

  ctx.restore();
};
