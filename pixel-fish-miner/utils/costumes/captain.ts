/**
 * Captain Costume
 * Features dark blue uniform with gold buttons, white beard, captain's hat, and tobacco pipe
 */
export const drawCaptainCostume = (ctx: CanvasRenderingContext2D) => {
  // Legs (Dark Blue)
  ctx.fillStyle = "#0d47a1";
  ctx.fillRect(0, -20, 8, 20);
  ctx.fillRect(12, -20, 8, 20);

  // Torso (Dark Blue Jacket)
  ctx.fillStyle = "#0d47a1";
  ctx.fillRect(-2, -45, 24, 25);

  // Gold Buttons
  ctx.fillStyle = "#ffca28";
  ctx.fillRect(8, -42, 4, 2);
  ctx.fillRect(8, -36, 4, 2);
  ctx.fillRect(8, -30, 4, 2);

  // Arms (Dark Blue sleeves)
  ctx.fillStyle = "#0d47a1";
  ctx.fillRect(-6, -42, 6, 16);
  ctx.fillRect(20, -42, 6, 16);
  // Hands
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(-6, -26, 6, 4);
  ctx.fillRect(20, -26, 6, 4);

  // Tobacco Pipe in Right Hand (held properly)
  // Pipe stem goes through/from hand
  ctx.fillStyle = "#5d4037"; // Dark brown stem
  ctx.fillRect(20, -25, 10, 2); // Stem extending from hand
  // Pipe bowl at the end
  ctx.fillStyle = "#8d6e63"; // Brown bowl
  ctx.fillRect(30, -27, 4, 5); // Bowl
  // Bowl opening/inside
  ctx.fillStyle = "#4e342e"; // Darker inside
  ctx.fillRect(31, -27, 2, 2); // Bowl opening

  // Head
  ctx.fillStyle = "#ffccbc";
  ctx.fillRect(2, -58, 16, 14);

  // Beard (White)
  ctx.fillStyle = "#eeeeee";
  ctx.fillRect(2, -48, 16, 6);

  // Captain Hat (Large White)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-2, -66, 24, 8);
  // Black Visor
  ctx.fillStyle = "black";
  ctx.fillRect(0, -58, 20, 2);
  // Gold Badge
  ctx.fillStyle = "#ffca28";
  ctx.fillRect(8, -64, 4, 4);
};
