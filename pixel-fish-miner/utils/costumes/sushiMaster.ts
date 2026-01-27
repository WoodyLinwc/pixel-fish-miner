/**
 * Sushi Master Costume
 * Features white chef coat, traditional headband, sushi knife, and sushi tower on head
 */
export const drawSushiMasterCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (Dark pants)
  ctx.fillStyle = "#424242"; // Dark gray pants
  ctx.fillRect(0, -20, 8, 20);
  ctx.fillRect(12, -20, 8, 20);

  // Torso (White chef coat)
  ctx.fillStyle = "#ffffff"; // White coat
  ctx.fillRect(-2, -45, 24, 25);

  // Coat cross-over (traditional style)
  ctx.fillStyle = "#f5f5f5"; // Slight gray for depth
  ctx.fillRect(2, -45, 16, 25);

  // Black collar trim
  ctx.fillStyle = "#212121";
  ctx.fillRect(0, -45, 4, 20); // Left lapel
  ctx.fillRect(16, -45, 4, 20); // Right lapel

  // Arms (White sleeves)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-6, -42, 6, 16);
  ctx.fillRect(20, -42, 6, 16);

  // Hands
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(-6, -26, 6, 4);
  ctx.fillRect(20, -26, 6, 4);

  // Sushi Knife in Right Hand (held properly, pointing inward)
  // Handle in hand
  ctx.fillStyle = "#5d4037"; // Dark wood handle
  ctx.fillRect(22, -25, 4, 3); // Handle held in hand
  // Blade extending from handle toward left
  ctx.fillStyle = "#b0bec5"; // Silver blade
  ctx.fillRect(12, -26, 10, 2); // Blade main body
  ctx.fillRect(10, -25, 2, 1); // Blade tip (pointed)
  // Blade shine
  ctx.fillStyle = "#eceff1"; // Highlight
  ctx.fillRect(14, -25, 6, 1); // Shine on blade

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Fill gap between head and hat with white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(2, -60, 16, 2);

  // Traditional headband (Hachimaki - white) - HIGHER
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, -66, 20, 6);

  // Red rising sun emblem on headband
  ctx.fillStyle = "#d32f2f";
  ctx.fillRect(8, -64, 4, 4);

  // Mustache (small, distinguished)
  ctx.fillStyle = "#212121";
  ctx.fillRect(4, -50, 4, 2); // Left side
  ctx.fillRect(12, -50, 4, 2); // Right side

  // --- THINNER PLATE ON HEAD ---
  // Fill gap between hat and plate
  ctx.fillStyle = "#e0e0e0"; // Gray support/base
  ctx.fillRect(6, -68, 8, 2); // Small base on top of hat

  // Plate (thinner - white ceramic with shadow, edges removed)
  ctx.fillStyle = "#f5f5f5"; // Light gray shadow/depth
  ctx.fillRect(-4, -70, 28, 2); // Thinner plate bottom edge (2px instead of 3px)
  ctx.fillStyle = "#ffffff"; // White plate surface
  ctx.fillRect(-4, -72, 28, 2); // Thinner plate top
  // Plate center detail (slight curve/shine)
  ctx.fillStyle = "#fafafa"; // Very light highlight
  ctx.fillRect(4, -71, 12, 1);

  // --- SUSHI PILE ON PLATE (bottom to top) - MOVED DOWN ---

  // BOTTOM LAYER: 3 SMALL FISH (moved down 2px)
  // Left fish (orange/red)
  ctx.fillStyle = "#ff6b35"; // Orange fish body
  ctx.fillRect(0, -75, 6, 3); // Body
  ctx.fillStyle = "#e63946"; // Red tail
  ctx.fillRect(-1, -74, 2, 1); // Tail fin
  ctx.fillStyle = "#212121"; // Black eye
  ctx.fillRect(5, -75, 1, 1);

  // Center fish (silver/gray)
  ctx.fillStyle = "#90a4ae"; // Silver fish body
  ctx.fillRect(7, -75, 6, 3); // Body
  ctx.fillStyle = "#607d8b"; // Darker tail
  ctx.fillRect(6, -74, 2, 1); // Tail fin
  ctx.fillStyle = "#212121"; // Black eye
  ctx.fillRect(12, -75, 1, 1);

  // Right fish (blue)
  ctx.fillStyle = "#42a5f5"; // Blue fish body
  ctx.fillRect(14, -75, 6, 3); // Body
  ctx.fillStyle = "#1976d2"; // Darker blue tail
  ctx.fillRect(13, -74, 2, 1); // Tail fin
  ctx.fillStyle = "#212121"; // Black eye
  ctx.fillRect(19, -75, 1, 1);

  // MIDDLE LAYER: 2 ONIGIRI (moved down 2px)
  // Left onigiri
  ctx.fillStyle = "#ffffff"; // White rice triangle
  ctx.fillRect(3, -84, 5, 2); // Top tip
  ctx.fillRect(2, -82, 7, 3); // Middle
  ctx.fillRect(1, -79, 9, 3); // Bottom
  // Nori wrap on bottom
  ctx.fillStyle = "#212121";
  ctx.fillRect(2, -79, 7, 2);

  // Right onigiri
  ctx.fillStyle = "#ffffff"; // White rice triangle
  ctx.fillRect(12, -84, 5, 2); // Top tip
  ctx.fillRect(11, -82, 7, 3); // Middle
  ctx.fillRect(10, -79, 9, 3); // Bottom
  // Nori wrap on bottom
  ctx.fillStyle = "#212121";
  ctx.fillRect(11, -79, 7, 2);

  // TOP LAYER: 1 TEMPURA SHRIMP (centered) (moved down 2px)
  ctx.fillStyle = "#ffb74d"; // Golden fried coating
  // Shrimp body (curved)
  ctx.fillRect(6, -92, 3, 6); // Tail section
  ctx.fillRect(8, -90, 4, 6); // Body section
  ctx.fillRect(11, -88, 3, 4); // Head section
  // Darker fried bits
  ctx.fillStyle = "#ff9800";
  ctx.fillRect(7, -91, 2, 2);
  ctx.fillRect(9, -89, 2, 2);
  // Shrimp tail detail (red)
  ctx.fillStyle = "#d32f2f";
  ctx.fillRect(6, -93, 2, 2);
};
