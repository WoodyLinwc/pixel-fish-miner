/**
 * Default Fisherman Costume
 * Classic fisherman look with yellow hat and red vest
 */
export const drawDefaultFisherman = (ctx: CanvasRenderingContext2D) => {
  // Legs (Blue pants)
  ctx.fillStyle = "#283593";
  ctx.fillRect(0, -20, 8, 20);
  ctx.fillRect(12, -20, 8, 20);

  // Torso (Red vest with stripes)
  ctx.fillStyle = "#c62828";
  ctx.fillRect(-2, -45, 24, 25);
  ctx.fillStyle = "#b71c1c";
  ctx.fillRect(2, -45, 4, 25);
  ctx.fillRect(10, -45, 4, 25);

  // Arms
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(-6, -42, 6, 20);
  ctx.fillRect(20, -42, 6, 20);

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Beard (Greyish)
  ctx.fillStyle = "#eeeeee";
  ctx.fillRect(2, -48, 16, 8);

  // Hat (Yellow)
  ctx.fillStyle = "#fdd835";
  ctx.fillRect(0, -62, 20, 6);
  ctx.fillRect(14, -62, 10, 4);
};
