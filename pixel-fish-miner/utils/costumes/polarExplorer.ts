/**
 * Polar Explorer Costume
 * Features heavy winter parka, fur trim, ice axe, and expedition gear
 */
export const drawPolarExplorerCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (thick insulated pants)
  ctx.fillStyle = "#37474f"; // Dark gray winter pants
  ctx.fillRect(0, -20, 8, 20);
  ctx.fillRect(12, -20, 8, 20);

  // Heavy winter boots
  ctx.fillStyle = "#212121"; // Black snow boots
  ctx.fillRect(-1, -6, 10, 6);
  ctx.fillRect(11, -6, 10, 6);
  // Boot fur trim
  ctx.fillStyle = "#eeeeee"; // White fur
  ctx.fillRect(0, -6, 8, 2);
  ctx.fillRect(12, -6, 8, 2);

  // Thick parka/coat (orange for visibility)
  ctx.fillStyle = "#ff6f00"; // Bright orange parka
  ctx.fillRect(-4, -48, 28, 28);

  // Parka zipper (darker center line)
  ctx.fillStyle = "#e65100"; // Darker orange
  ctx.fillRect(8, -48, 4, 28);
  // Zipper pull
  ctx.fillStyle = "#90a4ae"; // Metal zipper
  ctx.fillRect(9, -46, 2, 3);

  // Pockets with Velcro flaps
  ctx.fillStyle = "#e65100";
  ctx.fillRect(0, -30, 8, 6);
  ctx.fillRect(12, -30, 8, 6);

  // Fur-lined hood trim (around shoulders/neck)
  ctx.fillStyle = "#ffffff"; // White fur trim
  ctx.fillRect(-2, -48, 24, 3);

  // Left Arm (thick sleeve)
  ctx.fillStyle = "#ff6f00"; // Orange sleeve
  ctx.fillRect(-6, -45, 6, 22);
  // Glove (thick winter glove)
  ctx.fillStyle = "#212121"; // Black glove
  ctx.fillRect(-6, -23, 6, 5);

  // Right Arm (holding ice axe)
  ctx.fillStyle = "#ff6f00"; // Orange sleeve
  ctx.fillRect(20, -45, 6, 22);
  // Glove (thick winter glove)
  ctx.fillStyle = "#212121"; // Black glove
  ctx.fillRect(20, -23, 6, 5);

  // Ice Axe in right hand (proper mountaineering tool)
  // Handle (held in hand, extending down)
  ctx.fillStyle = "#8d6e63"; // Brown wooden handle
  ctx.fillRect(23, -18, 2, 20); // Handle extends down past hand
  // Hand grip wrap
  ctx.fillStyle = "#d32f2f"; // Red grip tape
  ctx.fillRect(23, -22, 2, 4);
  // Axe head (metal, extending from top of hand)
  ctx.fillStyle = "#78909c"; // Metal axe head
  ctx.fillRect(21, -26, 6, 3); // Pick side (horizontal)
  ctx.fillRect(25, -26, 4, 3); // Adze side
  // Ice pick point
  ctx.fillStyle = "#eceff1"; // Shiny metal point
  ctx.fillRect(19, -26, 2, 2);
  // Wrist strap
  ctx.fillStyle = "#ff6f00"; // Orange safety strap
  ctx.fillRect(22, -24, 4, 1);

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Parka hood with fur trim
  ctx.fillStyle = "#ff6f00"; // Orange hood
  ctx.fillRect(-2, -66, 24, 10);
  // Hood opening (shows face)
  ctx.fillStyle = "#ff6f00";
  ctx.fillRect(1, -58, 18, 2);
  // Fur trim around face (white)
  ctx.fillStyle = "#ffffff"; // White fur lining
  ctx.fillRect(0, -60, 20, 2);
  ctx.fillRect(-2, -64, 2, 6); // Left fur
  ctx.fillRect(20, -64, 2, 6); // Right fur

  // Hair peeking out (brown, windswept)
  ctx.fillStyle = "#6d4c41"; // Medium brown
  ctx.fillRect(2, -60, 4, 3); // Left side
  ctx.fillRect(14, -60, 4, 3); // Right side

  // Protective ski goggles
  ctx.fillStyle = "#263238"; // Dark frame
  ctx.fillRect(2, -54, 16, 6);
  // Reflective lenses (mirror/orange tint)
  ctx.fillStyle = "#ff9800"; // Orange mirror lens
  ctx.fillRect(3, -53, 6, 4); // Left lens
  ctx.fillRect(11, -53, 6, 4); // Right lens
  // Goggle strap
  ctx.fillStyle = "#212121";
  ctx.fillRect(-2, -52, 4, 2);
  ctx.fillRect(18, -52, 4, 2);

  // Neck warmer/scarf
  ctx.fillStyle = "#d32f2f"; // Red scarf
  ctx.fillRect(4, -48, 12, 4);
};
