/**
 * Cat Pet
 * Features orange tabby coloring, sitting pose, triangular ears, white chest, and upright tail
 */
export const drawCat = (ctx: CanvasRenderingContext2D, bob: number) => {
  ctx.translate(0, bob);

  // Orange Tabby
  ctx.fillStyle = "#fb8c00";
  // Body (Sitting)
  ctx.fillRect(0, -10, 12, 10);

  // Head
  ctx.fillRect(2, -16, 10, 8);

  // Ears
  ctx.fillStyle = "#e65100";
  ctx.beginPath();
  ctx.moveTo(3, -16);
  ctx.lineTo(5, -19);
  ctx.lineTo(7, -16); // Left
  ctx.moveTo(8, -16);
  ctx.lineTo(10, -19);
  ctx.lineTo(12, -16); // Right
  ctx.fill();

  // White Chest
  ctx.fillStyle = "#fff3e0";
  ctx.fillRect(2, -8, 4, 6);

  // Tail (Up)
  ctx.fillStyle = "#fb8c00";
  ctx.fillRect(-2, -8, 2, 8);
  ctx.fillRect(-4, -10, 2, 4);

  // Eyes
  ctx.fillStyle = "#1b5e20"; // Green eyes
  ctx.fillRect(4, -13, 2, 2);
  ctx.fillRect(9, -13, 2, 2);
};
