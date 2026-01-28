/**
 * Pelican Pet
 * Features white body, yellow beak, expandable throat pouch with gulp animation
 */
export const drawPelican = (
  ctx: CanvasRenderingContext2D,
  time: number,
  bob: number,
) => {
  ctx.translate(0, bob);

  // Body (White Block)
  ctx.fillStyle = "white";
  ctx.fillRect(-7, -12, 14, 12);

  // Neck (White Vertical Block)
  ctx.fillRect(0, -20, 6, 8);

  // Head (White Block)
  ctx.fillRect(0, -24, 8, 6);

  // Beak (Yellow Block)
  ctx.fillStyle = "#fdd835";
  ctx.fillRect(8, -24, 10, 4);

  // Throat Pouch (Deep Orange Blocks)
  const gulp = Math.sin(time * 0.002) * 2;
  ctx.fillStyle = "#fb8c00";
  // Main pouch block
  ctx.fillRect(8, -20, 10, 6 + Math.floor(gulp));
  // Bottom tip
  ctx.fillRect(10, -14 + Math.floor(gulp), 6, 2);

  // Eye (Square)
  ctx.fillStyle = "black";
  ctx.fillRect(4, -22, 2, 2);

  // Wing (Grey Block folded)
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(-5, -10, 8, 6);

  // Legs (Orange Blocks)
  ctx.fillStyle = "#f57f17";
  ctx.fillRect(-3, 0, 2, 4);
  ctx.fillRect(1, 0, 2, 4);
};
