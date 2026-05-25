/**
 * Migration Fish drawing functions
 * These fish only spawn during migration events
 */

// ---------------------------------------------------------------------------
// Helper: draw a crown matching the reference shape — flat base, 3 prongs,
// centre prong noticeably taller than the two sides, solid bright yellow.
//
// crownW  – total width of the crown (scales to fish size)
// topY    – y-coordinate of the fish body top (i.e. -h/2); crown sits above
// ---------------------------------------------------------------------------
const drawCrown = (
  ctx: CanvasRenderingContext2D,
  topY: number,
  crownW: number,
  offsetX: number = 0,
) => {
  const cw = crownW;
  const half = cw / 2;
  const ox = offsetX; // horizontal shift (positive = toward fish head on right)

  // Heights relative to topY (all upward, so negative direction)
  const baseH = Math.round(cw * 0.14);
  const sideH = Math.round(cw * 0.55);
  const midH = Math.round(cw * 0.85);
  const vallyY = topY - baseH - Math.round(cw * 0.08);

  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.moveTo(ox - half, topY);
  ctx.lineTo(ox - half, topY - baseH - sideH);
  ctx.lineTo(ox - half / 2, vallyY);
  ctx.lineTo(ox, topY - baseH - midH);
  ctx.lineTo(ox + half / 2, vallyY);
  ctx.lineTo(ox + half, topY - baseH - sideH);
  ctx.lineTo(ox + half, topY);
  ctx.closePath();
  ctx.fill();
};

// ---------------------------------------------------------------------------
// Standard migration fish
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// King migration fish — same body art, plus a royal crown on top
// ---------------------------------------------------------------------------

export const drawKingSaury = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Same body as Pacific Saury but with a golden aura tint
  const bodyColor = "#29b6f6"; // Slightly richer cyan (royalty)
  const darkBlue = "#0277bd";

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Darker top stripe
  ctx.fillStyle = darkBlue;
  ctx.fillRect(-w / 2, -h / 2, w, h / 3);

  // Belly
  ctx.fillStyle = "#e1f5fe";
  ctx.fillRect(-w / 2, h / 4, w - 6, h / 4);

  // Beak-like mouth
  ctx.fillStyle = darkBlue;
  ctx.fillRect(w / 2, -1, 4, 2);

  // Forked tail
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

  // Crown — shifted right toward the fish head
  drawCrown(ctx, -h / 2, 9, w / 4);
};

export const drawKingMullet = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Same body as Mullet but slightly warmer tone
  const bodyColor = "#607d8b";
  const darkGrey = "#455a64";

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Darker back
  ctx.fillStyle = darkGrey;
  ctx.fillRect(-w / 2, -h / 2, w, h / 2);

  // Silver belly stripe
  ctx.fillStyle = "#cfd8dc";
  ctx.fillRect(-w / 2 + 4, h / 4, w - 10, h / 4);

  // Deeply forked tail
  ctx.fillStyle = darkGrey;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 8, -7);
  ctx.lineTo(-w / 2 - 6, 0);
  ctx.lineTo(-w / 2 - 8, 7);
  ctx.fill();

  // Dorsal fins
  ctx.fillStyle = darkGrey;
  ctx.fillRect(4, -h / 2 - 4, 6, 4);
  ctx.fillRect(-12, -h / 2 - 3, 5, 3);

  // Pelvic fin
  ctx.fillRect(0, h / 2, 4, 3);

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -4, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 2, -3, 2, 2);

  // Crown — shifted right toward the fish head
  drawCrown(ctx, -h / 2, 11, w / 4);
};

export const drawKingAnchovy = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Same body as Anchovy
  const bodyColor = "#90a4ae";
  const darkBlue = "#546e7a";

  // Body (very slender)
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Dark top
  ctx.fillStyle = darkBlue;
  ctx.fillRect(-w / 2, -h / 2, w, h / 3);

  // Lateral stripe
  ctx.fillStyle = "#78909c";
  ctx.fillRect(-w / 2 + 2, -1, w - 6, 2);

  // V-shaped tail
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

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -2, 2, 2);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 1, -1, 1, 1);

  // Crown — shifted right toward the fish head
  drawCrown(ctx, -h / 2, 8, w / 4);
};
