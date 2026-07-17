export const drawWhale = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Whale: Keep Blocky Design (User liked it)
  ctx.fillStyle = "#5c6bc0"; // Indigo
  // Upper Body
  ctx.fillRect(-w / 2, -h / 2, w, h * 0.6);
  // Lower Body (Jaw/Belly)
  ctx.fillStyle = "#e8eaf6"; // Whiteish
  ctx.fillRect(-w / 2, h * 0.1, w, h * 0.4);

  // Belly Lines
  ctx.fillStyle = "#9fa8da";
  ctx.fillRect(-w / 4, h * 0.1, w / 2, 2);
  ctx.fillRect(-w / 4, h * 0.25, w / 2, 2);
  ctx.fillRect(-w / 4, h * 0.4, w / 2, 2);

  // Tail
  ctx.fillStyle = "#5c6bc0";
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 15, -15);
  ctx.lineTo(-w / 2 - 15, 15);
  ctx.lineTo(-w / 2, 5);
  ctx.fill();

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 4, -5, 6, 6);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 4 + 2, -3, 2, 2);

  // Blowhole
  ctx.fillStyle = "#3949ab";
  ctx.fillRect(0, -h / 2 - 2, 6, 2);

  // Water Spout
  if (Math.random() > 0.8) {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(0, -h / 2 - 10, 4, 6);
    ctx.fillRect(-4, -h / 2 - 16, 4, 4);
    ctx.fillRect(4, -h / 2 - 16, 4, 4);
  }
};

export const drawSailfish = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) => {
  // Sailfish: sleek blue body, long bill, iconic tall dorsal sail
  const bodyBlue = "#1565c0";
  const deepBlue = "#0d47a1";
  const sailBlue = "#1976d2";
  const silver = "#e1f5fe";
  const stripe = "#90caf9";

  // --- SAIL (drawn first so body overlaps the base) ---
  ctx.fillStyle = sailBlue;
  ctx.beginPath();
  ctx.moveTo(-w / 5, -h / 2); // back base
  ctx.lineTo(w / 3, -h / 2); // front base
  ctx.lineTo(w / 8, -h / 2 - h * 1.9); // tall front peak
  ctx.lineTo(-w / 4, -h / 2 - h * 1.2); // swept-back peak
  ctx.closePath();
  ctx.fill();

  // --- BODY ---
  // Upper (dark blue)
  ctx.fillStyle = bodyBlue;
  ctx.fillRect(-w / 2, -h / 2, w, h * 0.5);

  // Belly (silver)
  ctx.fillStyle = silver;
  ctx.fillRect(-w / 2, 0, w - 8, h / 2);

  // Lateral stripe
  ctx.fillStyle = stripe;
  ctx.fillRect(-w / 2, -2, w - 4, 4);

  // --- BILL ---
  ctx.fillStyle = deepBlue;
  ctx.beginPath();
  ctx.moveTo(w / 2, -h / 6);
  ctx.lineTo(w / 2 + Math.round(w * 0.5), 0);
  ctx.lineTo(w / 2, h / 6);
  ctx.fill();

  // --- TAIL (forked) ---
  ctx.fillStyle = bodyBlue;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 12, -10);
  ctx.lineTo(-w / 2 - 6, 0);
  ctx.lineTo(-w / 2 - 12, 10);
  ctx.fill();

  // --- BOTTOM FIN ---
  ctx.fillStyle = sailBlue;
  ctx.beginPath();
  ctx.moveTo(-w / 6, h / 2); // back base
  ctx.lineTo(w / 6, h / 2); // front base
  ctx.lineTo(0, h / 2 + 9); // pointy tip
  ctx.closePath();
  ctx.fill();

  // --- EYE ---
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -4, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 2, -3, 2, 2);
};

export const drawNarwhal = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) => {
  // --- NARWHAL REDESIGN ---
  // Magical, ethereal creature.

  // Body: Gradient from white to pastel pink/blue
  const gradient = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  gradient.addColorStop(0, "#e1f5fe"); // Light Blue
  gradient.addColorStop(0.5, "#ffffff"); // White center
  gradient.addColorStop(1, "#fce4ec"); // Light Pink
  ctx.fillStyle = gradient;

  // Upper Body Curve
  ctx.beginPath();
  ctx.moveTo(w / 2, 0); // Nose base
  ctx.quadraticCurveTo(0, -h, -w / 2, 0); // High arch back
  ctx.lineTo(w / 2, 0);
  ctx.fill();

  // Belly (Lighter)
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.quadraticCurveTo(0, h / 2, -w / 2, 0); // Rounded belly
  ctx.fill();

  // Tail (Fan shape)
  ctx.fillStyle = "#b3e5fc"; // Pastel blue
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 15, -10);
  ctx.lineTo(-w / 2 - 5, 0);
  ctx.lineTo(-w / 2 - 15, 10);
  ctx.fill();

  // Tusk (The Magical Horn)
  // Pulsating glow
  const glow = Math.abs(Math.sin(time * 0.005));
  ctx.shadowBlur = 10 + glow * 10;
  ctx.shadowColor = "#ffd700"; // Gold glow

  ctx.fillStyle = "#fff59d"; // Light Gold base
  // Tusk shape
  const tuskLen = w * 0.7;
  const tuskBaseX = w / 2;
  const tuskBaseY = -5;

  ctx.beginPath();
  ctx.moveTo(tuskBaseX, tuskBaseY);
  ctx.lineTo(tuskBaseX + tuskLen, tuskBaseY - 8); // Pointy tip up
  ctx.lineTo(tuskBaseX, tuskBaseY + 6);
  ctx.fill();

  // Reset shadow for other parts
  ctx.shadowBlur = 0;

  // Spiral details on tusk (Gold lines)
  ctx.strokeStyle = "#fbc02d"; // Darker Gold
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tuskBaseX + 5, tuskBaseY);
  ctx.lineTo(tuskBaseX + 10, tuskBaseY - 1);
  ctx.moveTo(tuskBaseX + 15, tuskBaseY - 2);
  ctx.lineTo(tuskBaseX + 20, tuskBaseY - 3);
  ctx.moveTo(tuskBaseX + 25, tuskBaseY - 4);
  ctx.lineTo(tuskBaseX + 30, tuskBaseY - 5);
  ctx.stroke();

  // Eye (Cute Anime Style)
  // White sclera
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(w / 4, -2, 5, 0, Math.PI * 2);
  ctx.fill();

  // Black pupil
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(w / 4 + 1, -2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Shine
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(w / 4 + 2, -3, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Blush
  ctx.fillStyle = "rgba(244, 143, 177, 0.6)";
  ctx.beginPath();
  ctx.arc(w / 4, 4, 3, 0, Math.PI * 2);
  ctx.fill();
};

export const drawOceanSunfish = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  const gray = "#b0bec5";
  const lightGray = "#eceff1";
  const darkGray = "#78909c";

  // Dorsal fin — shifted toward the tail, drawn first so the body overlaps its base
  ctx.fillStyle = darkGray;
  ctx.beginPath();
  ctx.moveTo(-w / 3, -h / 3.2);
  ctx.lineTo(-w / 2.5, -h / 2 - h / 3);
  ctx.lineTo(-w / 8, -h / 3.2);
  ctx.fill();

  // Anal fin (mirrored below, also shifted back)
  ctx.beginPath();
  ctx.moveTo(-w / 3, h / 3.2);
  ctx.lineTo(-w / 2.5, h / 2 + h / 3);
  ctx.lineTo(-w / 8, h / 3.2);
  ctx.fill();

  // Round disc body (drawn on top of the fin bases) — shorter, more compact oval
  ctx.fillStyle = gray;
  ctx.beginPath();
  if (ctx.ellipse) {
    ctx.ellipse(0, 0, w / 2.2, h / 2.3, 0, 0, Math.PI * 2);
  } else {
    ctx.fillRect(-w / 2, -h / 2.4, w, h / 1.2);
  }
  ctx.fill();

  // Lighter belly patch
  ctx.fillStyle = lightGray;
  ctx.beginPath();
  if (ctx.ellipse) {
    ctx.ellipse(0, h / 8, w / 3.2, h / 3.6, 0, 0, Math.PI * 2);
  }
  ctx.fill();

  // Small equilateral-triangle pectoral fin on the body side
  ctx.fillStyle = darkGray;
  {
    const finCx = w / 6;
    const finCy = -h / 20;
    const finSize = w / 4.2;
    const R = finSize / Math.sqrt(3);
    const rot = 0; // flat vertical edge on the left, point aiming right
    ctx.beginPath();
    ctx.moveTo(finCx + R * Math.cos(rot), finCy + R * Math.sin(rot));
    ctx.lineTo(
      finCx + R * Math.cos(rot + (2 * Math.PI) / 3),
      finCy + R * Math.sin(rot + (2 * Math.PI) / 3),
    );
    ctx.lineTo(
      finCx + R * Math.cos(rot + (4 * Math.PI) / 3),
      finCy + R * Math.sin(rot + (4 * Math.PI) / 3),
    );
    ctx.closePath();
    ctx.fill();
  }

  // Stubby scalloped clavus (tail)
  ctx.fillStyle = lightGray;
  ctx.fillRect(-w / 2.2 - 3, -h / 8, 5, h / 4);

  // Small puckered mouth
  ctx.fillStyle = darkGray;
  ctx.fillRect(w / 2.2 - 2, -2, 4, 4);

  // Beady surprised eye, positioned closer toward the mouth
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3.2, -h / 8, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3.2 + 2, -h / 8 + 1, 2, 2);
};
