/**
 * Dog Pet
 * Features brown coloring, sitting pose, floppy ears, snout, and wagging tail animation
 */
export const drawDog = (
  ctx: CanvasRenderingContext2D,
  time: number,
  bob: number,
) => {
  ctx.translate(0, bob);

  // Brown Dog (Sitting)
  ctx.fillStyle = "#8d6e63";

  // Body
  ctx.fillRect(0, -12, 14, 12);

  // Head
  ctx.fillRect(4, -18, 10, 8);

  // Ears (Floppy)
  ctx.fillStyle = "#5d4037";
  ctx.fillRect(2, -16, 4, 6); // Left ear flap
  ctx.fillRect(12, -16, 4, 6); // Right ear flap

  // Snout
  ctx.fillStyle = "#d7ccc8";
  ctx.fillRect(12, -14, 4, 4);

  // Nose
  ctx.fillStyle = "black";
  ctx.fillRect(15, -14, 2, 2);

  // Eyes
  ctx.fillStyle = "black";
  ctx.fillRect(6, -15, 2, 2);
  ctx.fillRect(10, -15, 2, 2);

  // Tail (Wagging)
  const tailWag = Math.sin(time * 0.015) * 4;
  ctx.fillStyle = "#8d6e63";
  ctx.save();
  ctx.translate(-2, -4);
  ctx.rotate(tailWag * 0.1);
  ctx.fillRect(-4, -2, 6, 2);
  ctx.restore();
};
