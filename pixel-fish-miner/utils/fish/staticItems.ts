import { SURFACE_Y } from "../../constants";

export const drawMysteryBag = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Bag Shape
  ctx.fillStyle = "#8d6e63"; // Sack color
  ctx.beginPath();
  ctx.arc(0, 5, w / 2, 0, Math.PI * 2); // Body
  ctx.fill();
  ctx.fillRect(-w / 4, -h / 2, w / 2, h / 4); // Neck
  // Tie
  ctx.fillStyle = "#ef5350";
  ctx.fillRect(-w / 4 - 2, -h / 3, w / 2 + 4, 4);
  // Question Mark
  ctx.fillStyle = "#fff176";
  ctx.font = 'bold 14px "Press Start 2P"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", 0, 5);
};

export const drawSupplyBox = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  y: number,
) => {
  // Check if in air to draw parachute
  const inAir = y < SURFACE_Y;

  if (inAir) {
    // Draw Parachute
    ctx.save();
    ctx.translate(0, -h); // Move up to top of box

    // Cords
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 2, 0);
    ctx.lineTo(-w, -40);
    ctx.moveTo(w / 2 - 2, 0);
    ctx.lineTo(w, -40);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -45);
    ctx.stroke();

    // Canopy (White Hemisphere)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, -40, w * 1.2, Math.PI, 0);
    // Scalloped bottom edge
    ctx.bezierCurveTo(w * 0.8, -45, w * 0.4, -35, 0, -40);
    ctx.bezierCurveTo(-w * 0.4, -35, -w * 0.8, -45, -w * 1.2, -40);
    ctx.fill();

    // Red stripe on canopy
    ctx.fillStyle = "#ef5350";
    ctx.beginPath();
    ctx.arc(0, -40, w * 1.2, Math.PI * 1.3, Math.PI * 1.7);
    ctx.fill();

    ctx.restore();
  }

  // --- WOODEN CRATE DESIGN ---
  // Main Body (Light Wood)
  ctx.fillStyle = "#bcaaa4";
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Frame (Dark Wood)
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 3;
  ctx.strokeRect(-w / 2, -h / 2, w, h);

  // Horizontal Planks (Simple lines)
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 6);
  ctx.lineTo(w / 2, -h / 6);
  ctx.moveTo(-w / 2, h / 6);
  ctx.lineTo(w / 2, h / 6);
  ctx.stroke();

  // Nails/Rivets (Corner dots)
  ctx.fillStyle = "#3e2723";
  const inset = 4;
  ctx.fillRect(-w / 2 + inset, -h / 2 + inset, 2, 2);
  ctx.fillRect(w / 2 - inset - 2, -h / 2 + inset, 2, 2);
  ctx.fillRect(-w / 2 + inset, h / 2 - inset - 2, 2, 2);
  ctx.fillRect(w / 2 - inset - 2, h / 2 - inset - 2, 2, 2);

  // Dollar Sign Stamp (Green)
  ctx.fillStyle = "#2e7d32";
  ctx.font = 'bold 12px "Press Start 2P"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", 0, 1);
};

export const drawShell = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Fan shape shell
  ctx.fillStyle = "#f48fb1"; // Pinkish
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.arc(0, h / 2, w / 2, Math.PI, 0); // Top semi-circle
  ctx.fill();

  // Ridges (Lines radiating from bottom center)
  ctx.strokeStyle = "#c2185b";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < 5; i++) {
    const angle = Math.PI + (Math.PI / 5) * i;
    ctx.moveTo(0, h / 2);
    ctx.lineTo((Math.cos(angle) * w) / 2, h / 2 + (Math.sin(angle) * h) / 2);
  }
  ctx.stroke();

  // Bottom hinge
  ctx.fillStyle = "#c2185b";
  ctx.fillRect(-4, h / 2 - 2, 8, 4);
};

export const drawSeaCucumber = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Sea Cucumber: Bumpy long oval
  ctx.fillStyle = "#7b1fa2"; // Purple

  // Main body (Rounded Rect)
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 8);
  ctx.fill();

  // Bumps/Spikes
  ctx.fillStyle = "#ad1457";
  // Random bumps based on position for consistency
  ctx.fillRect(-w / 3, -h / 2 - 2, 4, 4);
  ctx.fillRect(0, -h / 2 - 2, 4, 4);
  ctx.fillRect(w / 3, -h / 2 - 2, 4, 4);

  ctx.fillRect(-w / 4, h / 2 - 2, 4, 4);
  ctx.fillRect(w / 4, h / 2 - 2, 4, 4);

  // Mouth?
  ctx.fillStyle = "#4a148c";
  ctx.beginPath();
  ctx.arc(w / 2 - 2, 0, 3, 0, Math.PI * 2);
  ctx.fill();
};

export const drawCoral = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Colors
  const cBase = "#ffab91"; // Soft pink/orange
  const cDark = "#ff7043"; // Darker shade
  const cLight = "#ffe0b2"; // Light tips

  const bottomY = h / 2;

  // Helper
  const rect = (x: number, y: number, w: number, h: number, col: string) => {
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
  };

  // Wide irregular base
  rect(-20, bottomY - 8, 40, 8, cBase);
  // Texture on base
  rect(-15, bottomY - 6, 4, 4, cDark);
  rect(5, bottomY - 5, 6, 3, cDark);

  // Draw individual branches spreading out

  // 1. Far Left (Curving out)
  rect(-20, bottomY - 15, 6, 10, cBase); // segment 1
  rect(-24, bottomY - 22, 6, 10, cBase); // segment 2 (left)
  rect(-26, bottomY - 28, 5, 8, cBase); // segment 3 (tip)
  rect(-26, bottomY - 30, 5, 2, cLight); // tip highlight

  // 2. Mid Left (Up and slightly left)
  rect(-8, bottomY - 18, 7, 12, cBase);
  rect(-10, bottomY - 28, 6, 12, cBase);
  rect(-10, bottomY - 30, 6, 2, cLight);
  // Small side nub
  rect(-6, bottomY - 20, 4, 4, cBase);

  // 3. Center (Short, split)
  rect(0, bottomY - 14, 8, 8, cBase);
  rect(2, bottomY - 20, 4, 6, cBase);
  rect(2, bottomY - 22, 4, 2, cLight);

  // 4. Mid Right (Up and right)
  rect(10, bottomY - 16, 7, 10, cBase);
  rect(12, bottomY - 26, 6, 12, cBase);
  rect(14, bottomY - 34, 5, 10, cBase);
  rect(14, bottomY - 36, 5, 2, cLight);
  // Texture dot
  rect(12, bottomY - 22, 2, 2, cDark);

  // 5. Far Right (Curving out hard)
  rect(18, bottomY - 12, 6, 8, cBase);
  rect(22, bottomY - 18, 6, 8, cBase);
  rect(26, bottomY - 24, 5, 8, cBase);
  rect(26, bottomY - 26, 5, 2, cLight);

  // Shadow at very bottom
  rect(-22, bottomY - 2, 44, 2, cDark);
};

export const drawAnchor = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Apply slight tilt (rotate 12 degrees clockwise)
  ctx.rotate(0.21); // ~12 degrees in radians

  // Colors for metallic anchor - darker, more grey
  const cDark = "#546e7a"; // Dark base
  const cMid = "#607d8b"; // Mid tone
  const cLight = "#78909c"; // Lighter metal
  const cHighlight = "#90a4ae"; // Bright highlights

  // --- TOP RING ---
  // Outer ring (larger)
  ctx.fillStyle = cMid;
  ctx.fillRect(-5, -h / 2, 10, 2); // Top
  ctx.fillRect(-5, -h / 2 + 7, 10, 2); // Bottom
  ctx.fillRect(-5, -h / 2, 2, 9); // Left
  ctx.fillRect(3, -h / 2, 2, 9); // Right

  // Inner hole (darker)
  ctx.fillStyle = cDark;
  ctx.fillRect(-3, -h / 2 + 2, 6, 5);

  // Highlight on ring
  ctx.fillStyle = cHighlight;
  ctx.fillRect(-4, -h / 2, 3, 1);
  ctx.fillRect(3, -h / 2 + 1, 1, 2);

  // --- MAIN SHAFT (Vertical center post) ---
  const shaftWidth = 4;
  ctx.fillStyle = cMid;
  ctx.fillRect(-shaftWidth / 2, -h / 2 + 9, shaftWidth, h - 14);

  // Shaft shadow (left side)
  ctx.fillStyle = cDark;
  ctx.fillRect(-shaftWidth / 2, -h / 2 + 9, 1, h - 14);

  // Shaft highlight (right side)
  ctx.fillStyle = cLight;
  ctx.fillRect(shaftWidth / 2 - 1, -h / 2 + 9, 1, h - 14);

  // --- CROSS BAR (Horizontal stock) ---
  const crossY = -h / 2 + 16;
  const crossWidth = 28;
  const crossHeight = 4;

  ctx.fillStyle = cMid;
  ctx.fillRect(-crossWidth / 2, crossY, crossWidth, crossHeight);

  // Crossbar shadow (bottom)
  ctx.fillStyle = cDark;
  ctx.fillRect(-crossWidth / 2, crossY + crossHeight - 1, crossWidth, 1);

  // Crossbar highlight (top)
  ctx.fillStyle = cLight;
  ctx.fillRect(-crossWidth / 2, crossY, crossWidth, 1);

  // Ends of crossbar (ball ends)
  ctx.fillStyle = cMid;
  ctx.fillRect(-crossWidth / 2 - 2, crossY - 1, 2, crossHeight + 2);
  ctx.fillRect(crossWidth / 2, crossY - 1, 2, crossHeight + 2);

  // --- LEFT ARM (Lower curved section with arc) ---
  // Build curved arm from shaft to fluke
  ctx.fillStyle = cMid;

  // Starting from center, gradually curve outward
  ctx.fillRect(-2, h / 2 - 20, 3, 4); // Start at shaft
  ctx.fillRect(-4, h / 2 - 16, 4, 4); // Curve out
  ctx.fillRect(-6, h / 2 - 12, 4, 4); // Continue curve
  ctx.fillRect(-8, h / 2 - 8, 4, 4); // More curve
  ctx.fillRect(-10, h / 2 - 5, 4, 3); // Approaching fluke

  // Add inner edge for thickness/depth
  ctx.fillRect(-3, h / 2 - 18, 2, 3);
  ctx.fillRect(-5, h / 2 - 14, 2, 3);
  ctx.fillRect(-7, h / 2 - 10, 2, 3);

  // Left fluke (triangular point)
  ctx.fillStyle = cMid;
  ctx.fillRect(-14, h / 2 - 7, 5, 7); // Main fluke body
  ctx.fillRect(-17, h / 2 - 5, 3, 5); // Pointed tip
  ctx.fillRect(-19, h / 2 - 3, 2, 3); // Very tip

  // Fluke inner curve/notch for depth
  ctx.fillStyle = cDark;
  ctx.fillRect(-11, h / 2 - 6, 2, 5);
  ctx.fillRect(-13, h / 2 - 4, 2, 3);

  // Left arm highlights on curved sections
  ctx.fillStyle = cLight;
  ctx.fillRect(-5, h / 2 - 15, 1, 2);
  ctx.fillRect(-7, h / 2 - 11, 1, 2);
  ctx.fillRect(-9, h / 2 - 7, 1, 2);

  // Shadow on underside of curve
  ctx.fillStyle = cDark;
  ctx.fillRect(-4, h / 2 - 14, 1, 2);
  ctx.fillRect(-6, h / 2 - 10, 1, 2);
  ctx.fillRect(-8, h / 2 - 6, 1, 2);

  // --- RIGHT ARM (Lower curved section with arc - mirror) ---
  // Build curved arm from shaft to fluke
  ctx.fillStyle = cMid;

  // Starting from center, gradually curve outward
  ctx.fillRect(-1, h / 2 - 20, 3, 4); // Start at shaft
  ctx.fillRect(0, h / 2 - 16, 4, 4); // Curve out
  ctx.fillRect(2, h / 2 - 12, 4, 4); // Continue curve
  ctx.fillRect(4, h / 2 - 8, 4, 4); // More curve
  ctx.fillRect(6, h / 2 - 5, 4, 3); // Approaching fluke

  // Add inner edge for thickness/depth
  ctx.fillRect(1, h / 2 - 18, 2, 3);
  ctx.fillRect(3, h / 2 - 14, 2, 3);
  ctx.fillRect(5, h / 2 - 10, 2, 3);

  // Right fluke (triangular point)
  ctx.fillStyle = cMid;
  ctx.fillRect(9, h / 2 - 7, 5, 7); // Main fluke body
  ctx.fillRect(14, h / 2 - 5, 3, 5); // Pointed tip
  ctx.fillRect(17, h / 2 - 3, 2, 3); // Very tip

  // Fluke inner curve/notch for depth
  ctx.fillStyle = cDark;
  ctx.fillRect(9, h / 2 - 6, 2, 5);
  ctx.fillRect(11, h / 2 - 4, 2, 3);

  // Right arm highlights on curved sections
  ctx.fillStyle = cLight;
  ctx.fillRect(5, h / 2 - 15, 1, 2);
  ctx.fillRect(7, h / 2 - 11, 1, 2);
  ctx.fillRect(9, h / 2 - 7, 1, 2);

  // Shadow on underside of curve
  ctx.fillStyle = cDark;
  ctx.fillRect(4, h / 2 - 14, 1, 2);
  ctx.fillRect(6, h / 2 - 10, 1, 2);
  ctx.fillRect(8, h / 2 - 6, 1, 2);

  // --- CENTER STOCK (Bottom of shaft where arms meet) ---
  ctx.fillStyle = cMid;
  ctx.fillRect(-shaftWidth / 2, h / 2 - 5, shaftWidth, 5);

  // Stock shadow
  ctx.fillStyle = cDark;
  ctx.fillRect(-shaftWidth / 2, h / 2 - 3, 1, 3);

  // Add overall shadow at very bottom (wider to account for curve)
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(-20, h / 2 - 1, 40, 2);
};
