/**
 * Migration Fish drawing functions
 * These fish only spawn during migration events
 */

export const drawPacificSaury = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Slender, elongated fish with silvery blue color
  const bodyColor = "#4fc3f7"; // Light cyan-blue
  const darkBlue = "#0288d1"; // Darker blue for top

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Darker top stripe
  ctx.fillStyle = darkBlue;
  ctx.fillRect(-w / 2, -h / 2, w, h / 3);

  // Belly (lighter)
  ctx.fillStyle = "#e1f5fe";
  ctx.fillRect(-w / 2, h / 4, w - 6, h / 4);

  // Elongated beak-like mouth
  ctx.fillStyle = darkBlue;
  ctx.fillRect(w / 2, -1, 4, 2);

  // Tail (forked, like herring)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 7, -5);
  ctx.lineTo(-w / 2 - 5, 0);
  ctx.lineTo(-w / 2 - 7, 5);
  ctx.fill();

  // Dorsal fin
  ctx.fillStyle = darkBlue;
  ctx.fillRect(-w / 4, -h / 2 - 3, 5, 3);

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -2, 3, 3);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 1, -1, 1, 1);
};

export const drawMullet = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Robust body with blue-grey color and forked tail
  const bodyColor = "#78909c"; // Blue-grey
  const darkGrey = "#546e7a"; // Darker grey

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Darker back
  ctx.fillStyle = darkGrey;
  ctx.fillRect(-w / 2, -h / 2, w, h / 2);

  // Silver belly stripe
  ctx.fillStyle = "#cfd8dc";
  ctx.fillRect(-w / 2 + 4, h / 4, w - 10, h / 4);

  // Tail (deeply forked)
  ctx.fillStyle = darkGrey;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 8, -7);
  ctx.lineTo(-w / 2 - 6, 0);
  ctx.lineTo(-w / 2 - 8, 7);
  ctx.fill();

  // Dorsal fins (two)
  ctx.fillStyle = darkGrey;
  // Front dorsal
  ctx.fillRect(4, -h / 2 - 4, 6, 4);
  // Back dorsal
  ctx.fillRect(-12, -h / 2 - 3, 5, 3);

  // Pelvic fin
  ctx.fillRect(0, h / 2, 4, 3);

  // Eye (larger)
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -4, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 2, -3, 2, 2);
};

export const drawAnchovy = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Small, slender fish with silver-grey color
  const bodyColor = "#b0bec5"; // Light grey-blue
  const darkBlue = "#607d8b"; // Dark grey-blue

  // Body (very slender)
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Dark top
  ctx.fillStyle = darkBlue;
  ctx.fillRect(-w / 2, -h / 2, w, h / 3);

  // Lateral stripe (signature anchovy feature)
  ctx.fillStyle = "#90a4ae";
  ctx.fillRect(-w / 2 + 2, -1, w - 6, 2);

  // Tail (small, v-shaped)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 5, -4);
  ctx.lineTo(-w / 2 - 4, 0);
  ctx.lineTo(-w / 2 - 5, 4);
  ctx.fill();

  // Small dorsal fin
  ctx.fillStyle = darkBlue;
  ctx.fillRect(-4, -h / 2 - 2, 4, 2);

  // Eye (small)
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -2, 2, 2);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 1, -1, 1, 1);
};
