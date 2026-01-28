/**
 * Marine Scientist Costume
 * Features lab coat, research equipment, clipboard, and professional look
 */
export const drawMarineScientistCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (khaki/beige pants)
  ctx.fillStyle = "#c9b99a"; // Khaki pants
  ctx.fillRect(0, -20, 8, 20);
  ctx.fillRect(12, -20, 8, 20);

  // Water boots
  ctx.fillStyle = "#263238"; // Dark rubber boots
  ctx.fillRect(0, -6, 8, 6);
  ctx.fillRect(12, -6, 8, 6);

  // Blue shirt under coat
  ctx.fillStyle = "#42a5f5"; // Light blue shirt
  ctx.fillRect(0, -45, 20, 25);

  // White lab coat
  ctx.fillStyle = "#ffffff"; // Lab coat
  ctx.fillRect(-4, -45, 28, 25);
  // Lab coat opening/lapels
  ctx.fillStyle = "#f5f5f5"; // Slightly gray for depth
  ctx.fillRect(8, -45, 4, 25);

  // Coat pockets
  ctx.fillStyle = "#e0e0e0"; // Pocket outlines
  ctx.fillRect(0, -32, 8, 8);
  ctx.fillRect(12, -32, 8, 8);

  // Left Arm (holding clipboard)
  ctx.fillStyle = "#ffffff"; // White sleeve
  ctx.fillRect(-6, -42, 6, 16);
  ctx.fillStyle = "#ffccbc"; // Hand
  ctx.fillRect(-6, -26, 6, 4);

  // Clipboard in left hand
  ctx.fillStyle = "#8d6e63"; // Brown clipboard backing
  ctx.fillRect(-14, -38, 10, 14);
  ctx.fillStyle = "#ffffff"; // White paper
  ctx.fillRect(-13, -37, 8, 11);
  // Paper lines (data/notes)
  ctx.fillStyle = "#424242";
  ctx.fillRect(-12, -35, 6, 1);
  ctx.fillRect(-12, -32, 6, 1);
  ctx.fillRect(-12, -29, 6, 1);
  // Clipboard clip
  ctx.fillStyle = "#90a4ae"; // Metal clip
  ctx.fillRect(-11, -38, 4, 2);

  // Right Arm (holding water sample)
  ctx.fillStyle = "#ffffff"; // White sleeve
  ctx.fillRect(20, -42, 6, 16);
  ctx.fillStyle = "#ffccbc"; // Hand
  ctx.fillRect(20, -26, 6, 4);

  // Test tube/water sample in right hand
  ctx.fillStyle = "#90a4ae"; // Glass tube (gray)
  ctx.fillRect(24, -32, 4, 10);
  // Water sample inside (blue)
  ctx.fillStyle = "#4dd0e1"; // Cyan water sample
  ctx.fillRect(25, -30, 2, 7);
  // Cork/cap
  ctx.fillStyle = "#8d6e63"; // Brown cork
  ctx.fillRect(24, -33, 4, 2);

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Long feminine hair (dark brown, flowing down)
  ctx.fillStyle = "#5d4037"; // Dark brown hair
  // Top of head (full coverage)
  ctx.fillRect(0, -66, 20, 8);
  // Left side hair (flowing down past shoulders)
  ctx.fillRect(-2, -60, 4, 16);
  // Right side hair (flowing down past shoulders)
  ctx.fillRect(18, -60, 4, 16);
  // Hair strands on forehead (bangs)
  ctx.fillStyle = "#6d4c41"; // Lighter brown for depth
  ctx.fillRect(4, -62, 3, 4);
  ctx.fillRect(8, -62, 2, 4);
  ctx.fillRect(11, -62, 3, 4);

  // Earrings (pearl - scientific elegance)
  ctx.fillStyle = "#f5f5f5"; // White pearl
  ctx.fillRect(1, -52, 2, 2);
  ctx.fillRect(17, -52, 2, 2);

  // ID badge on coat
  ctx.fillStyle = "#ffffff"; // Badge background
  ctx.fillRect(14, -42, 6, 8);
  ctx.fillStyle = "#1976d2"; // Blue stripe on badge
  ctx.fillRect(14, -42, 6, 3);
  // Photo placeholder
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(15, -39, 4, 4);
};
