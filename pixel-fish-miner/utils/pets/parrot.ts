/**
 * Parrot Pet
 * Features green body, red wing, yellow head, grey beak, and blue tail
 */
export const drawParrot = (ctx: CanvasRenderingContext2D, bob: number) => {
  ctx.translate(0, bob);

  // Green body
  ctx.fillStyle = "#43a047";
  ctx.fillRect(0, -12, 10, 12);

  // Red Wing
  ctx.fillStyle = "#d32f2f";
  ctx.fillRect(2, -8, 6, 6);

  // Yellow Head/Neck
  ctx.fillStyle = "#fdd835";
  ctx.fillRect(2, -16, 8, 6);

  // Beak (Grey)
  ctx.fillStyle = "#616161";
  ctx.fillRect(8, -14, 4, 3);

  // Eye
  ctx.fillStyle = "black";
  ctx.fillRect(6, -14, 2, 2);

  // Tail
  ctx.fillStyle = "#1976d2"; // Blue tail
  ctx.fillRect(-4, -6, 4, 2);
  ctx.fillRect(-6, -4, 6, 2);

  // Legs
  ctx.fillStyle = "#f57f17";
  ctx.fillRect(2, 0, 2, 2);
  ctx.fillRect(6, 0, 2, 2);
};
