/**
 * Pirate Costume
 * Features hook hand, wooden leg, bandana, eye patch, and pistol
 */
export const drawPirateCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (One wooden)
  ctx.fillStyle = "#283593"; // Dark pants
  ctx.fillRect(0, -20, 8, 20); // Right leg (normal)
  ctx.fillStyle = "#8d6e63"; // Wooden leg
  ctx.fillRect(14, -20, 4, 20);

  // Torso (Red/Black stripes or Vest)
  ctx.fillStyle = "#b71c1c"; // Red Vest
  ctx.fillRect(-2, -45, 24, 25);
  ctx.fillStyle = "#212121"; // Black Shirt
  ctx.fillRect(2, -45, 16, 25);

  // Left Arm (Skin)
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(-6, -42, 6, 16);

  // Hook Hand (Left)
  ctx.fillStyle = "#90a4ae"; // Metal grey
  // Hook shaft
  ctx.fillRect(-6, -26, 6, 4);
  // Hook curve
  ctx.beginPath();
  ctx.fillStyle = "#90a4ae";
  ctx.fillRect(-8, -24, 2, 6);
  ctx.fillRect(-10, -18, 4, 2);
  ctx.fillRect(-8, -20, 2, 2);
  // Hook point
  ctx.fillStyle = "#eceff1"; // Shiny tip
  ctx.fillRect(-10, -18, 2, 1);

  // Right Arm (Skin)
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(20, -42, 6, 16);

  // Pirate Pistol (Right hand)
  // Handle (Wood)
  ctx.fillStyle = "#5d4037";
  ctx.fillRect(24, -25, 4, 6);
  // Barrel (Metal)
  ctx.fillStyle = "#546e7a";
  ctx.fillRect(28, -24, 8, 4);
  // Barrel tip
  ctx.fillStyle = "#37474f";
  ctx.fillRect(36, -24, 2, 4);
  // Hammer
  ctx.fillStyle = "#78909c";
  ctx.fillRect(26, -26, 2, 2);
  // Gold trim on handle
  ctx.fillStyle = "#fdd835";
  ctx.fillRect(24, -23, 4, 1);

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Bandana (Red)
  ctx.fillStyle = "#d32f2f";
  ctx.fillRect(0, -62, 20, 8);
  ctx.fillRect(16, -60, 6, 4); // Knot

  // Eye Patch
  ctx.fillStyle = "black";
  ctx.fillRect(10, -54, 4, 4);
};
