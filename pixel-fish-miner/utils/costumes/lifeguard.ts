/**
 * Lifeguard Costume
 * Features red uniform with cross emblem, lifebuoy, drink, visor cap, and whistle
 */
export const drawLifeguardCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (Red shorts)
  ctx.fillStyle = "#d32f2f"; // Red shorts
  ctx.fillRect(0, -20, 8, 12);
  ctx.fillRect(12, -20, 8, 12);

  // Legs below shorts (skin)
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(0, -8, 8, 8);
  ctx.fillRect(12, -8, 8, 8);

  // Torso (Red tank top)
  ctx.fillStyle = "#d32f2f"; // Red top
  ctx.fillRect(-2, -45, 24, 25);

  // White cross emblem
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(8, -38, 4, 12); // Vertical
  ctx.fillRect(4, -34, 12, 4); // Horizontal

  // Left Arm (holding lifebuoy)
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(-6, -42, 6, 20);

  // Lifebuoy on left hand (moved closer to body)
  // Outer ring (orange/red)
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(-18, -36, 20, 20); // Outer square (moved 4px right)
  // Cut out the hollow center (transparent/background)
  ctx.fillStyle = "#87ceeb"; // Sky blue for hollow center
  ctx.fillRect(-14, -32, 12, 12); // Inner hollow
  // White stripes on buoy (all 4 sides)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-18, -33, 4, 14); // Left vertical stripe
  ctx.fillRect(-2, -33, 4, 14); // Right vertical stripe
  ctx.fillRect(-15, -36, 14, 4); // Top horizontal stripe
  ctx.fillRect(-15, -19, 14, 3); // Bottom horizontal stripe
  // Rope attachment detail
  ctx.fillStyle = "#ffd54f"; // Yellow rope
  ctx.fillRect(-8, -38, 2, 4);

  // Right Arm (holding drink)
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(20, -42, 6, 20);

  // Drink cup in right hand (slightly bigger)
  ctx.fillStyle = "#ffeb3b"; // Yellow cup
  ctx.fillRect(24, -30, 8, 10);
  // Straw
  ctx.fillStyle = "#d32f2f"; // Red straw
  ctx.fillRect(29, -36, 2, 14);
  // Ice/liquid inside
  ctx.fillStyle = "#81c784"; // Green drink (lime/mint)
  ctx.fillRect(25, -28, 6, 7);
  // Ice cubes
  ctx.fillStyle = "#e3f2fd";
  ctx.fillRect(26, -27, 2, 2);
  ctx.fillRect(28, -25, 2, 2);

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Visor cap (Red with white bill)
  ctx.fillStyle = "#d32f2f"; // Red cap
  ctx.fillRect(2, -62, 16, 6);
  ctx.fillStyle = "#ffffff"; // White bill
  ctx.fillRect(0, -58, 20, 2);

  // Whistle on neck (silver)
  ctx.fillStyle = "#90a4ae";
  ctx.fillRect(8, -46, 4, 2);
};
