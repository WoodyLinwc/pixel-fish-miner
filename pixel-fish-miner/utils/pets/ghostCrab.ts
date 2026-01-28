/**
 * Ghost Crab Pet
 * Features pale sand-colored body, eye stalks, legs, and claws with skitter animation
 */
export const drawGhostCrab = (ctx: CanvasRenderingContext2D, time: number) => {
  // Skitter animation (Horizontal movement)
  const skitter = Math.sin(time * 0.01) * 8;
  ctx.translate(skitter, 0);

  // Pale Body (Sand color) - STRICTLY RECTANGULAR
  ctx.fillStyle = "#efebe9";
  ctx.fillRect(-7, -8, 14, 8); // Box body

  // Eyes Stalks (Vertical Rects)
  ctx.fillStyle = "#d7ccc8";
  ctx.fillRect(-6, -14, 2, 6);
  ctx.fillRect(4, -14, 2, 6);

  // Eye dots (Square)
  ctx.fillStyle = "black";
  ctx.fillRect(-6, -14, 2, 2);
  ctx.fillRect(4, -14, 2, 2);

  // Legs (Pixel steps)
  ctx.fillStyle = "#efebe9";
  // Left legs
  ctx.fillRect(-9, -2, 2, 2);
  ctx.fillRect(-10, -4, 2, 2);
  ctx.fillRect(-9, -6, 2, 2);
  // Right legs
  ctx.fillRect(7, -2, 2, 2);
  ctx.fillRect(8, -4, 2, 2);
  ctx.fillRect(7, -6, 2, 2);

  // Claws (Blocky)
  ctx.fillStyle = "#d7ccc8";
  // Left claw (small)
  ctx.fillRect(-11, -8, 4, 4);
  ctx.fillRect(-11, -9, 2, 1); // Tip

  // Right claw (big)
  ctx.fillRect(7, -10, 6, 6);
  ctx.fillRect(7, -11, 2, 1); // Tip
};
