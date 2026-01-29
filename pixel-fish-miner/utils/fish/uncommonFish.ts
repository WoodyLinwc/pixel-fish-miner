export const drawClownfish = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Pixel Clown: Rectangular Body with Vertical Stripes
  ctx.fillStyle = "#ff6d00"; // Orange
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Tail
  ctx.fillRect(-w / 2 - 6, -6, 6, 12);

  // Stripes (White blocks) using relative sizing
  const stripeW = w * 0.15;
  ctx.fillStyle = "white";
  // Middle stripe
  ctx.fillRect(-stripeW / 2, -h / 2, stripeW, h);
  // Head stripe
  ctx.fillRect(w / 3, -h / 2, stripeW * 0.8, h);
  // Tail stripe
  ctx.fillRect(-w / 2 + 2, -h / 2, stripeW * 0.8, h);

  // Eye (White Sclera)
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -4, 3, 3);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 1, -3, 2, 2);
};

export const drawSquid = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Squid: Pointy head (mantle) on Right, tentacles on Left
  const bodyColor = "#e57373"; // Pinkish Red

  // Head/Mantle Tip (Triangle)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(0, -h / 3);
  ctx.lineTo(0, h / 3);
  ctx.fill();

  // Mantle Body (Rect)
  ctx.fillRect(-w / 3, -h / 3, w / 3, h * 0.66);

  // Tentacles
  ctx.fillStyle = "#ffcdd2"; // Lighter pink
  const tLen = w / 2;
  ctx.fillRect(-w / 3 - tLen, -h / 4, tLen, 3);
  ctx.fillRect(-w / 3 - tLen, -2, tLen, 3);
  ctx.fillRect(-w / 3 - tLen, h / 4 - 3, tLen, 3);

  // Eyes (Adjusted to be near the base of tentacles)
  // Positioned at the left edge of the main body (-w/3)
  ctx.fillStyle = "white";
  ctx.fillRect(-w / 4, -6, 5, 5); // Behind (top)
  ctx.fillRect(-w / 4, 2, 5, 5); // Front (bottom)

  ctx.fillStyle = "black";
  ctx.fillRect(-w / 4 + 1, -5, 2, 2);
  ctx.fillRect(-w / 4 + 1, 3, 2, 2);
};

export const drawSeaBass = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Sea Bass: Greenish, robust
  const bodyColor = "#9ccc65"; // Light Green
  const darkColor = "#689f38"; // Dark Green

  // Body (Rounded Rect approximation)
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Top Fin (Spiky)
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.moveTo(-w / 4, -h / 2);
  ctx.lineTo(0, -h / 2 - 6);
  ctx.lineTo(w / 4, -h / 2);
  ctx.fill();

  // Tail
  ctx.fillStyle = darkColor;
  ctx.fillRect(-w / 2 - 8, -6, 8, 12);

  // Horizontal faint stripes (UPDATED)
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  for (let i = 1; i < 4; i++) {
    // Spacing vertically
    ctx.fillRect(-w / 2 + 5, -h / 2 + i * (h / 4), w - 10, 2);
  }

  // Lateral Line
  ctx.fillStyle = darkColor;
  ctx.fillRect(-w / 2 + 5, 0, w - 10, 2);

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -5, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 2, -4, 2, 2);
};

export const drawRedSnapper = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Pinkish red
  ctx.fillStyle = "#ef5350";
  // Body
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Spiky dorsal fin
  ctx.fillStyle = "#c62828";
  ctx.beginPath();
  ctx.moveTo(-10, -h / 2);
  ctx.lineTo(0, -h / 2 - 8);
  ctx.lineTo(10, -h / 2);
  ctx.fill();

  // Tail
  ctx.fillStyle = "#c62828";
  ctx.fillRect(-w / 2 - 6, -8, 6, 16);

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 4, -6, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 4 + 1, -5, 2, 2);
};

export const drawSalmon = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // King Salmon: Pink/Orange body, Dark head
  const bodyColor = "#ff8a65"; // Deep Orange/Pink
  const headColor = "#607d8b"; // Blue Grey
  const finColor = "#37474f";

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w / 2, -h / 2, w * 0.7, h); // Rear 70% is pink

  // Head (Front 30%)
  ctx.fillStyle = headColor;
  ctx.fillRect(w * 0.2, -h / 2, w * 0.3, h);

  // Tail
  ctx.fillStyle = finColor;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 8, -8);
  ctx.lineTo(-w / 2 - 8, 8);
  ctx.fill();

  // Specks on back
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(-w / 4, -h / 2 + 2, 2, 2);
  ctx.fillRect(-w / 3, -h / 2 + 4, 2, 2);
  ctx.fillRect(0, -h / 2 + 3, 2, 2);
  // Additional specks
  ctx.fillRect(-w / 5, -h / 2 + 6, 2, 2);
  ctx.fillRect(w / 5, -h / 2 + 2, 2, 2);
  ctx.fillRect(-w / 2 + 6, -h / 2 + 3, 2, 2);
  ctx.fillRect(w / 10, -h / 2 + 5, 2, 2);

  // Lateral Line
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(-w / 2, 0, w * 0.7, 1);

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -4, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 2, -3, 2, 2);
};

export const drawTuna = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Blocky Tuna: Split colors horizontal
  // Top half
  ctx.fillStyle = "#1565c0"; // Dark Blue
  ctx.fillRect(-w / 2, -h / 2, w, h / 2);

  // Bottom half
  ctx.fillStyle = "#90caf9"; // Light Blue/Grey
  ctx.fillRect(-w / 2, 0, w, h / 2);

  // Tail
  ctx.fillStyle = "#0d47a1";
  ctx.fillRect(-w / 2 - 10, -8, 10, 16);

  // Yellow finlets (pixels)
  ctx.fillStyle = "#ffeb3b";
  ctx.fillRect(-w / 4, -h / 2 - 2, 4, 2);
  ctx.fillRect(0, -h / 2 - 2, 4, 2);
  ctx.fillRect(-w / 4, h / 2, 4, 2);
  ctx.fillRect(0, h / 2, 4, 2);

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w / 3, -4, 4, 4);
  ctx.fillStyle = "black";
  ctx.fillRect(w / 3 + 1, -4, 2, 2);
};

export const drawNeedlefish = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Needlefish: Long thin body, long beak
  ctx.fillStyle = "#80deea"; // Cyan/Light Blue

  // Body (Cylinder)
  ctx.fillRect(-w / 2, -h / 2, w * 0.7, h);

  // Long Beak (Top and Bottom jaws)
  ctx.fillStyle = "#4dd0e1";
  ctx.fillRect(w * 0.2, -2, w * 0.3, 2); // Top jaw
  ctx.fillRect(w * 0.2, 1, w * 0.35, 2); // Bottom jaw (slightly longer)

  // Dorsal/Anal fins (Set far back)
  ctx.fillStyle = "#00bcd4";
  ctx.beginPath();
  ctx.moveTo(-w / 4, -h / 2);
  ctx.lineTo(-w / 3, -h / 2 - 6);
  ctx.lineTo(-w / 2 + 5, -h / 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-w / 4, h / 2);
  ctx.lineTo(-w / 3, h / 2 + 6);
  ctx.lineTo(-w / 2 + 5, h / 2);
  ctx.fill();

  // Tail (Forked)
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 6, -6);
  ctx.lineTo(-w / 2 - 6, 6);
  ctx.fill();

  // Eye
  ctx.fillStyle = "white";
  ctx.fillRect(w * 0.15, -4, 3, 3);
  ctx.fillStyle = "black";
  ctx.fillRect(w * 0.15 + 1, -3, 2, 2);
};

export const drawPhantomPerch = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Phantom Perch: Ethereal ghostly fish with translucent appearance
  const ghostColor = "rgba(200, 230, 255, 0.4)"; // Translucent pale blue
  const glowColor = "rgba(150, 200, 255, 0.6)";

  // Body (Semi-transparent)
  ctx.fillStyle = ghostColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Ethereal glow outline
  ctx.fillStyle = glowColor;
  ctx.fillRect(-w / 2, -h / 2, w, 2); // Top
  ctx.fillRect(-w / 2, h / 2 - 2, w, 2); // Bottom
  ctx.fillRect(-w / 2, -h / 2, 2, h); // Left
  ctx.fillRect(w / 2 - 2, -h / 2, 2, h); // Right

  // Ghostly dorsal fin
  ctx.fillStyle = "rgba(180, 220, 255, 0.5)";
  ctx.beginPath();
  ctx.moveTo(-w / 4, -h / 2);
  ctx.lineTo(0, -h / 2 - 8);
  ctx.lineTo(w / 4, -h / 2);
  ctx.fill();

  // Wispy tail (multiple layers for ethereal effect)
  ctx.fillStyle = "rgba(200, 230, 255, 0.3)";
  ctx.fillRect(-w / 2 - 8, -8, 8, 16);
  ctx.fillStyle = "rgba(150, 200, 255, 0.5)";
  ctx.fillRect(-w / 2 - 6, -6, 6, 12);

  // Glowing eye
  ctx.fillStyle = "rgba(100, 200, 255, 0.8)";
  ctx.fillRect(w / 3, -4, 4, 4);
  ctx.fillStyle = "rgba(200, 240, 255, 0.9)";
  ctx.fillRect(w / 3 + 1, -3, 2, 2);

  // Spirit particles (small dots around the fish)
  ctx.fillStyle = "rgba(180, 220, 255, 0.6)";
  ctx.fillRect(-w / 3, -h / 2 - 4, 2, 2);
  ctx.fillRect(w / 4, -h / 2 - 3, 2, 2);
  ctx.fillRect(-w / 4, h / 2 + 2, 2, 2);
};

export const drawSpectralSardine = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Spectral Sardine: Small ghostly fish with wispy appearance
  const ghostColor = "rgba(220, 200, 255, 0.35)"; // Translucent pale purple
  const wispsColor = "rgba(180, 160, 255, 0.5)";

  // Body (Elongated, semi-transparent)
  ctx.fillStyle = ghostColor;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Ghostly stripes (vertical, faint)
  ctx.fillStyle = "rgba(200, 180, 255, 0.3)";
  ctx.fillRect(-w / 4, -h / 2, 2, h);
  ctx.fillRect(0, -h / 2, 2, h);
  ctx.fillRect(w / 4, -h / 2, 2, h);

  // Ethereal outline glow
  ctx.fillStyle = wispsColor;
  ctx.fillRect(-w / 2, -h / 2, w, 1);
  ctx.fillRect(-w / 2, h / 2 - 1, w, 1);

  // Wispy tail (trailing effect)
  ctx.fillStyle = "rgba(220, 200, 255, 0.25)";
  ctx.fillRect(-w / 2 - 10, -6, 10, 12);
  ctx.fillStyle = "rgba(200, 180, 255, 0.4)";
  ctx.fillRect(-w / 2 - 7, -4, 7, 8);

  // Small dorsal fin
  ctx.fillStyle = "rgba(200, 180, 255, 0.5)";
  ctx.beginPath();
  ctx.moveTo(-w / 6, -h / 2);
  ctx.lineTo(0, -h / 2 - 5);
  ctx.lineTo(w / 6, -h / 2);
  ctx.fill();

  // Glowing eye
  ctx.fillStyle = "rgba(150, 120, 255, 0.7)";
  ctx.fillRect(w / 3, -3, 3, 3);
  ctx.fillStyle = "rgba(220, 200, 255, 0.9)";
  ctx.fillRect(w / 3 + 1, -2, 2, 2);

  // Trailing wispy particles
  ctx.fillStyle = "rgba(200, 180, 255, 0.4)";
  ctx.fillRect(-w / 2 - 12, -2, 2, 2);
  ctx.fillRect(-w / 2 - 14, 1, 2, 2);
  ctx.fillRect(-w / 2 - 10, 3, 2, 2);
};

export const drawGhostSquid = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  // Ghost Squid: Ethereal translucent squid with flowing tentacles
  const ghostColor = "rgba(200, 220, 255, 0.4)"; // Pale translucent blue-white
  const glowColor = "rgba(180, 210, 255, 0.6)";

  // Mantle/Head (pointed on right side)
  ctx.fillStyle = ghostColor;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(0, -h / 3);
  ctx.lineTo(-w / 4, -h / 3);
  ctx.lineTo(-w / 4, h / 3);
  ctx.lineTo(0, h / 3);
  ctx.fill();

  // Ethereal glow outline on mantle
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(0, -h / 3);
  ctx.lineTo(-w / 4, -h / 3);
  ctx.lineTo(-w / 4, h / 3);
  ctx.lineTo(0, h / 3);
  ctx.closePath();
  ctx.stroke();

  // Ghostly tentacles (8 wispy tentacles)
  ctx.fillStyle = "rgba(210, 225, 255, 0.35)";
  const tentacleLength = w / 2;

  // Top tentacles
  ctx.fillRect(-w / 4 - tentacleLength, -h / 3 + 2, tentacleLength, 2);
  ctx.fillRect(-w / 4 - tentacleLength + 3, -h / 4, tentacleLength - 3, 2);

  // Middle tentacles
  ctx.fillRect(-w / 4 - tentacleLength + 2, -2, tentacleLength - 2, 2);
  ctx.fillRect(-w / 4 - tentacleLength, 2, tentacleLength, 2);

  // Bottom tentacles
  ctx.fillRect(-w / 4 - tentacleLength + 3, h / 4 - 2, tentacleLength - 3, 2);
  ctx.fillRect(-w / 4 - tentacleLength, h / 3 - 4, tentacleLength, 2);

  // Wispy tentacle ends (particles)
  ctx.fillStyle = "rgba(180, 200, 255, 0.3)";
  ctx.fillRect(-w / 4 - tentacleLength - 4, -h / 3 + 2, 3, 2);
  ctx.fillRect(-w / 4 - tentacleLength - 3, -2, 3, 2);
  ctx.fillRect(-w / 4 - tentacleLength - 4, h / 3 - 4, 3, 2);

  // Glowing eyes (two ethereal eyes)
  ctx.fillStyle = "rgba(150, 200, 255, 0.8)";
  ctx.fillRect(-w / 8, -6, 3, 3);
  ctx.fillRect(-w / 8, 3, 3, 3);

  ctx.fillStyle = "rgba(220, 240, 255, 0.95)";
  ctx.fillRect(-w / 8 + 1, -5, 2, 2);
  ctx.fillRect(-w / 8 + 1, 4, 2, 2);

  // Ethereal spots/patterns on mantle
  ctx.fillStyle = "rgba(180, 210, 240, 0.4)";
  ctx.fillRect(w / 4, -4, 2, 2);
  ctx.fillRect(w / 6, 2, 2, 2);
  ctx.fillRect(0, -6, 2, 2);
  ctx.fillRect(0, 4, 2, 2);

  // Spectral aura particles around squid
  ctx.fillStyle = "rgba(190, 215, 255, 0.5)";
  ctx.fillRect(-w / 3, -h / 2 - 3, 2, 2);
  ctx.fillRect(w / 3, -h / 3, 2, 2);
  ctx.fillRect(-w / 4, h / 2 + 1, 2, 2);
  ctx.fillRect(w / 4, h / 3, 2, 2);
};
