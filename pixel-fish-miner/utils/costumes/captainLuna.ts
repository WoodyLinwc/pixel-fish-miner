/**
 * Captain Luna Costume
 * Features sailor-inspired uniform with moon theme, bow, tiara and nautical aesthetic
 */
export const drawCaptainLunaCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (white stockings/legs) - SLIMMER
  ctx.fillStyle = "#ffccbc"; // Skin tone
  ctx.fillRect(2, -20, 6, 20);
  ctx.fillRect(12, -20, 6, 20);

  // Red boots/shoes - SLIMMER
  ctx.fillStyle = "#d32f2f"; // Red shoes
  ctx.fillRect(2, -4, 6, 4);
  ctx.fillRect(12, -4, 6, 4);

  // Blue skirt - SLIMMER
  ctx.fillStyle = "#1976d2"; // Navy blue skirt
  ctx.fillRect(0, -30, 20, 10);
  // Skirt pleats (white lines)
  ctx.fillStyle = "#e3f2fd";
  ctx.fillRect(3, -30, 2, 10);
  ctx.fillRect(9, -30, 2, 10);
  ctx.fillRect(15, -30, 2, 10);

  // White sailor top - SLIMMER
  ctx.fillStyle = "#ffffff"; // White uniform top
  ctx.fillRect(0, -45, 20, 15);

  // Blue sailor collar - SLIMMER
  ctx.fillStyle = "#1976d2"; // Navy blue collar
  ctx.fillRect(0, -45, 20, 6);
  // Collar lines
  ctx.fillStyle = "#e3f2fd";
  ctx.fillRect(2, -42, 16, 1);
  ctx.fillRect(3, -40, 14, 1);

  // Red bow on chest - SLIMMER
  ctx.fillStyle = "#d32f2f"; // Red bow
  ctx.fillRect(7, -40, 6, 4);
  ctx.fillRect(5, -38, 3, 2); // Left bow wing
  ctx.fillRect(12, -38, 3, 2); // Right bow wing

  // Arms (white sleeves with blue trim) - SLIMMER
  ctx.fillStyle = "#ffffff"; // White sleeves
  ctx.fillRect(-4, -42, 5, 16);
  ctx.fillRect(19, -42, 5, 16);
  // Blue trim on sleeves
  ctx.fillStyle = "#1976d2";
  ctx.fillRect(-4, -42, 5, 3);
  ctx.fillRect(19, -42, 5, 3);
  // Hands - SLIMMER
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(-4, -26, 5, 4);
  ctx.fillRect(19, -26, 5, 4);

  // White gloves
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-4, -26, 5, 3);
  ctx.fillRect(19, -26, 5, 3);

  // Head - SLIGHTLY WIDER FACE
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(3, -58, 14, 14);

  // Blonde hair (odango/bun style)
  ctx.fillStyle = "#fdd835"; // Blonde yellow
  // Left odango (bun)
  ctx.fillRect(-2, -62, 6, 6);
  ctx.fillRect(-4, -60, 2, 2); // Left extension
  // Right odango (bun)
  ctx.fillRect(16, -62, 6, 6);
  ctx.fillRect(22, -60, 2, 2); // Right extension
  // Hair on top
  ctx.fillRect(4, -64, 12, 6);
  // Hair strands (twin tails suggestion)
  ctx.fillRect(-2, -56, 4, 8);
  ctx.fillRect(18, -56, 4, 8);

  // Tiara (gold)
  ctx.fillStyle = "#ffca28"; // Gold tiara
  ctx.fillRect(5, -64, 10, 2);

  // TWO RED GEMS ON SIDES (instead of center)
  // Left gem
  ctx.fillStyle = "#e91e63"; // Pink/red gem
  ctx.fillRect(2, -64, 3, 3);
  // Left gem shine
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(2, -64, 1, 1);

  // Right gem
  ctx.fillStyle = "#e91e63"; // Pink/red gem
  ctx.fillRect(15, -64, 3, 3);
  // Right gem shine
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(15, -64, 1, 1);

  // Moon crescent detail on forehead
  ctx.fillStyle = "#ffca28"; // Gold crescent
  ctx.fillRect(8, -60, 4, 2);
  ctx.fillRect(7, -59, 2, 1);
  ctx.fillRect(11, -59, 2, 1);
};
