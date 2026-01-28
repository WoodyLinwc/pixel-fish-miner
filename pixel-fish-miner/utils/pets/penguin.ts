/**
 * Penguin Pet
 * Features black and white body, orange beak and feet, with flapping wing animation
 */
export const drawPenguin = (
  ctx: CanvasRenderingContext2D,
  time: number,
  bob: number,
) => {
  ctx.translate(0, bob);

  // Body (Black Block)
  ctx.fillStyle = "#212121";
  ctx.fillRect(-7, -18, 14, 18);
  // Top head trim
  ctx.fillRect(-5, -20, 10, 2);

  // Belly (White Block)
  ctx.fillStyle = "white";
  ctx.fillRect(-5, -16, 10, 14);

  // Eyes (Square)
  ctx.fillStyle = "black";
  ctx.fillRect(-4, -14, 2, 2);
  ctx.fillRect(2, -14, 2, 2);

  // Beak (Orange Block)
  ctx.fillStyle = "#ff9800";
  ctx.fillRect(-1, -12, 2, 2);

  // Feet (Orange Blocks)
  ctx.fillStyle = "#ff9800";
  ctx.fillRect(-6, 0, 4, 2);
  ctx.fillRect(2, 0, 4, 2);

  // Wings (Black side blocks)
  // Little flap animation
  const flap = Math.sin(time * 0.01) * 2 > 0 ? 1 : 0;
  ctx.fillStyle = "#212121";

  // Left Wing
  ctx.fillRect(-8 - flap, -12, 2, 8);
  // Right Wing
  ctx.fillRect(6 + flap, -12, 2, 8);
};
