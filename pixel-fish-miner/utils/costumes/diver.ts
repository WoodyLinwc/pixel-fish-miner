/**
 * Diver Costume
 * Features wetsuit, diving mask, snorkel, and air tank
 */
export const drawDiverCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (Wetsuit)
  ctx.fillStyle = "#212121"; // Black wetsuit
  ctx.fillRect(0, -20, 8, 20);
  ctx.fillRect(12, -20, 8, 20);

  // Torso (Wetsuit with colored stripes)
  ctx.fillStyle = "#212121"; // Black wetsuit
  ctx.fillRect(-2, -45, 24, 25);

  // Colored stripe accents
  ctx.fillStyle = "#00bcd4"; // Cyan stripe
  ctx.fillRect(0, -38, 20, 3);
  ctx.fillRect(0, -28, 20, 3);

  // Arms (Wetsuit sleeves)
  ctx.fillStyle = "#212121";
  ctx.fillRect(-6, -42, 6, 20);
  ctx.fillRect(20, -42, 6, 20);

  // Air tank on back (visible on side)
  ctx.fillStyle = "#90a4ae"; // Gray tank
  ctx.fillRect(-6, -44, 5, 16);
  ctx.fillStyle = "#263238"; // Dark straps
  ctx.fillRect(-2, -40, 2, 2);
  ctx.fillRect(-2, -32, 2, 2);

  // Head (covered by mask)
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Few thin short hairs on top of head
  ctx.fillStyle = "#5d4037"; // Dark brown hair
  ctx.fillRect(4, -59, 2, 3); // Hair strand 1
  ctx.fillRect(8, -60, 2, 4); // Hair strand 2 (slightly taller)
  ctx.fillRect(12, -59, 2, 3); // Hair strand 3
  ctx.fillRect(6, -58, 2, 2); // Hair strand 4 (short)
  ctx.fillRect(14, -58, 2, 2); // Hair strand 5 (short)

  // Diving Mask (Large goggles)
  ctx.fillStyle = "#263238"; // Dark frame
  ctx.fillRect(0, -56, 20, 8);

  // Glass lenses (light blue tint)
  ctx.fillStyle = "#4dd0e1";
  ctx.fillRect(2, -54, 7, 4); // Left lens
  ctx.fillRect(11, -54, 7, 4); // Right lens

  // Snorkel tube (larger and more prominent)
  ctx.fillStyle = "#ffeb3b"; // Yellow snorkel
  ctx.fillRect(20, -64, 4, 18); // Longer vertical tube
  ctx.fillRect(16, -66, 4, 4); // Top bend
  ctx.fillRect(20, -66, 8, 4); // Top opening (wider)
  // Mouthpiece
  ctx.fillStyle = "#212121";
  ctx.fillRect(18, -58, 3, 4);
};
