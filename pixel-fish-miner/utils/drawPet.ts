export const drawPet = (
  ctx: CanvasRenderingContext2D,
  petId: string,
  x: number,
  y: number,
  time: number,
) => {
  ctx.save();
  ctx.translate(x, y);

  // Subtle idle animation calculation
  const bob = Math.sin(time * 0.005) * 2;

  if (petId === "goldfish") {
    // --- GOLDFISH TANK (Cuboid) ---
    // Does not bob up and down with the character breathing, sits flat on the boat deck
    ctx.translate(0, 4);

    const tankW = 24;
    const tankH = 16;
    const tankHalfW = tankW / 2;

    // Draw from bottom-center roughly (y=0 is bottom of pet area)
    // Tank Background (Glass tint)
    ctx.fillStyle = "rgba(225, 245, 254, 0.4)";
    ctx.fillRect(-tankHalfW, -tankH, tankW, tankH);

    // Water (Blue fill, slightly lower than top)
    const waterLevelY = -tankH + 4;
    ctx.fillStyle = "rgba(66, 165, 245, 0.8)"; // Semi-transparent blue
    ctx.fillRect(-tankHalfW + 2, waterLevelY, tankW - 4, tankH - 6);

    // Surface Line (Lighter blue)
    ctx.fillStyle = "#81d4fa";
    ctx.fillRect(-tankHalfW + 2, waterLevelY, tankW - 4, 2);

    // Plants (Green strips at bottom)
    ctx.fillStyle = "#66bb6a";
    ctx.fillRect(-6, -6, 2, 4); // Left weed
    ctx.fillRect(4, -8, 2, 6); // Right weed
    ctx.fillRect(-1, -5, 2, 3); // Center weed

    // Fish (Orange)
    // Animation: Swim left/right inside the tank
    const swimRange = 5;
    const swim = Math.sin(time * 0.003) * swimRange;
    const facingRight = Math.cos(time * 0.003) > 0;

    ctx.save();
    // Fish Y position roughly middle of water
    ctx.translate(swim, -tankH / 2 + 2);
    if (!facingRight) ctx.scale(-1, 1);

    ctx.fillStyle = "#ff6d00"; // Orange
    // Body
    ctx.fillRect(-3, -2, 6, 4);
    // Tail
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(-5, -2);
    ctx.lineTo(-5, 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "black";
    ctx.fillRect(1, -1, 1, 1);
    ctx.restore();

    // Bubbles
    const bubbleY = (time * 0.02) % 10;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    // Only show if bubble is below surface
    if (bubbleY < 8) {
      ctx.fillRect(swim + 3, -tankH / 2 + 2 - bubbleY, 1, 1);
    }

    // Tank Frame/Outline
    ctx.strokeStyle = "#90a4ae"; // Grey rim
    ctx.lineWidth = 2;
    ctx.strokeRect(-tankHalfW, -tankH, tankW, tankH);

    // Top Rim (Darker)
    ctx.fillStyle = "#546e7a";
    ctx.fillRect(-tankHalfW - 1, -tankH - 2, tankW + 2, 2);

    // Glare on glass (Diagonal lines)
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(-tankHalfW + 4, -tankH + 4);
    ctx.lineTo(-tankHalfW + 8, -tankH + 4);
    ctx.lineTo(-tankHalfW + 4, -tankH + 8);
    ctx.fill();
  } else if (petId === "ghost_crab") {
    // --- GHOST CRAB (Pixel Style) ---
    // Skitter animation (Horizontal movement)
    const skitter = Math.sin(time * 0.01) * 8;
    ctx.translate(skitter, 0);

    // Pale Body (Sand color) - STRICTLY RECTANGULAR
    ctx.fillStyle = "#efebe9";
    ctx.fillRect(-7, -8, 14, 8); // Box body

    // Eyes Stalks (Vertical Rects)
    ctx.fillStyle = "#d7ccc8";
    ctx.fillRect(-6, -14, 2, 6);
    ctx.fillRect(4, -14, 2, 6);

    // Eye dots (Square)
    ctx.fillStyle = "black";
    ctx.fillRect(-6, -14, 2, 2);
    ctx.fillRect(4, -14, 2, 2);

    // Legs (Pixel steps)
    ctx.fillStyle = "#efebe9";
    // Left legs
    ctx.fillRect(-9, -2, 2, 2);
    ctx.fillRect(-10, -4, 2, 2);
    ctx.fillRect(-9, -6, 2, 2);
    // Right legs
    ctx.fillRect(7, -2, 2, 2);
    ctx.fillRect(8, -4, 2, 2);
    ctx.fillRect(7, -6, 2, 2);

    // Claws (Blocky)
    ctx.fillStyle = "#d7ccc8";
    // Left claw (small)
    ctx.fillRect(-11, -8, 4, 4);
    ctx.fillRect(-11, -9, 2, 1); // Tip

    // Right claw (big)
    ctx.fillRect(7, -10, 6, 6);
    ctx.fillRect(7, -11, 2, 1); // Tip
  } else if (petId === "penguin") {
    // --- PENGUIN (Pixel Style) ---
    ctx.translate(0, bob);

    // Body (Black Block)
    ctx.fillStyle = "#212121";
    ctx.fillRect(-7, -18, 14, 18);
    // Top head trim
    ctx.fillRect(-5, -20, 10, 2);

    // Belly (White Block)
    ctx.fillStyle = "white";
    ctx.fillRect(-5, -16, 10, 14);

    // Eyes (Square)
    ctx.fillStyle = "black";
    ctx.fillRect(-4, -14, 2, 2);
    ctx.fillRect(2, -14, 2, 2);

    // Beak (Orange Block)
    ctx.fillStyle = "#ff9800";
    ctx.fillRect(-1, -12, 2, 2);

    // Feet (Orange Blocks)
    ctx.fillStyle = "#ff9800";
    ctx.fillRect(-6, 0, 4, 2);
    ctx.fillRect(2, 0, 4, 2);

    // Wings (Black side blocks)
    // Little flap animation
    const flap = Math.sin(time * 0.01) * 2 > 0 ? 1 : 0;
    ctx.fillStyle = "#212121";

    // Left Wing
    ctx.fillRect(-8 - flap, -12, 2, 8);
    // Right Wing
    ctx.fillRect(6 + flap, -12, 2, 8);
  } else if (petId === "pelican") {
    // --- PELICAN (Pixel Style) ---
    ctx.translate(0, bob);

    // Body (White Block)
    ctx.fillStyle = "white";
    ctx.fillRect(-7, -12, 14, 12);

    // Neck (White Vertical Block)
    ctx.fillRect(0, -20, 6, 8);

    // Head (White Block)
    ctx.fillRect(0, -24, 8, 6);

    // Beak (Yellow Block)
    ctx.fillStyle = "#fdd835";
    ctx.fillRect(8, -24, 10, 4);

    // Throat Pouch (Deep Orange Blocks)
    const gulp = Math.sin(time * 0.002) * 2;
    ctx.fillStyle = "#fb8c00";
    // Main pouch block
    ctx.fillRect(8, -20, 10, 6 + Math.floor(gulp));
    // Bottom tip
    ctx.fillRect(10, -14 + Math.floor(gulp), 6, 2);

    // Eye (Square)
    ctx.fillStyle = "black";
    ctx.fillRect(4, -22, 2, 2);

    // Wing (Grey Block folded)
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(-5, -10, 8, 6);

    // Legs (Orange Blocks)
    ctx.fillStyle = "#f57f17";
    ctx.fillRect(-3, 0, 2, 4);
    ctx.fillRect(1, 0, 2, 4);
  } else if (petId === "kraken") {
    // --- KRAKEN (Only massive tentacles visible, wrapping around boat) ---
    // ENORMOUS tentacles emerging from ALL SIDES of the boat
    ctx.translate(0, 4); // Lower position at water level

    // Animated tentacle wave - slower, more menacing
    const wave1 = Math.sin(time * 0.003) * 6;
    const wave2 = Math.sin(time * 0.003 + 1) * 6;
    const wave3 = Math.sin(time * 0.003 + 2) * 6;
    const wave4 = Math.sin(time * 0.003 + 3) * 6;
    const wave5 = Math.sin(time * 0.003 + 1.5) * 5;
    const wave6 = Math.sin(time * 0.003 + 2.5) * 5;
    const wave7 = Math.sin(time * 0.003 + 0.5) * 6;
    const wave8 = Math.sin(time * 0.003 + 3.5) * 5;

    // Dark purple/red color scheme for deep sea creature
    const krakenColor = "#5e35b1"; // Deep purple
    const suckerColor = "#311b92"; // Darker purple
    const highlightColor = "#7e57c2"; // Lighter purple for highlights

    // === FAR LEFT TENTACLE (THICKEST - 10px wide) ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(-65, -15 + wave1, 10, 40); // Main massive segment
    ctx.fillRect(-62, -24 + wave1, 10, 9); // Upper segment
    ctx.fillRect(-58, -32 + wave1, 9, 8); // Curling segment
    ctx.fillRect(-52, -38 + wave1, 8, 6); // Upper curl
    ctx.fillRect(-46, -42 + wave1, 6, 4); // Tip
    // Large suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(-62, -10 + wave1, 5, 5);
    ctx.fillRect(-62, -2 + wave1, 5, 5);
    ctx.fillRect(-62, 6 + wave1, 5, 5);
    ctx.fillRect(-62, 14 + wave1, 5, 5);
    ctx.fillRect(-62, 22 + wave1, 5, 5);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(-63, -12 + wave1, 3, 15);

    // === MID LEFT TENTACLE (THICK - 9px wide) ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(-45, -10 + wave2, 9, 35);
    ctx.fillRect(-43, -18 + wave2, 9, 8);
    ctx.fillRect(-40, -25 + wave2, 8, 7);
    ctx.fillRect(-36, -30 + wave2, 7, 5);
    ctx.fillRect(-32, -33 + wave2, 5, 3);
    // Suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(-43, -6 + wave2, 5, 5);
    ctx.fillRect(-43, 2 + wave2, 5, 5);
    ctx.fillRect(-43, 10 + wave2, 5, 5);
    ctx.fillRect(-43, 18 + wave2, 5, 5);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(-44, -8 + wave2, 3, 12);

    // === NEAR LEFT TENTACLE (Wrapping over boat) ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(-26, -3 + wave5, 8, 28);
    ctx.fillRect(-24, -10 + wave5, 8, 7);
    ctx.fillRect(-21, -15 + wave5, 7, 5);
    ctx.fillRect(-18, -18 + wave5, 5, 3);
    // Curling over boat rail
    ctx.fillRect(-17, 25, 7, 6);
    ctx.fillRect(-14, 29, 5, 4);
    // Suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(-25, 0 + wave5, 4, 4);
    ctx.fillRect(-25, 7 + wave5, 4, 4);
    ctx.fillRect(-25, 14 + wave5, 4, 4);
    ctx.fillRect(-25, 21 + wave5, 4, 4);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(-25, -1 + wave5, 3, 10);

    // === FAR RIGHT TENTACLE (THICKEST - 10px wide) - MORE SPREAD ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(60, -12 + wave3, 10, 38); // Further right, different height
    ctx.fillRect(57, -22 + wave3, 10, 10); // Upper segment
    ctx.fillRect(53, -30 + wave3, 9, 8); // Curling segment
    ctx.fillRect(48, -36 + wave3, 8, 6); // Upper curl
    ctx.fillRect(43, -40 + wave3, 6, 4); // Tip
    // Large suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(62, -8 + wave3, 5, 5);
    ctx.fillRect(62, 0 + wave3, 5, 5);
    ctx.fillRect(62, 8 + wave3, 5, 5);
    ctx.fillRect(62, 16 + wave3, 5, 5);
    ctx.fillRect(62, 24 + wave3, 5, 5);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(65, -10 + wave3, 3, 15);

    // === MID RIGHT TENTACLE (THICK - 9px wide) - IRREGULAR POSITION ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(40, -7 + wave4, 9, 32); // Different starting height
    ctx.fillRect(38, -16 + wave4, 9, 9); // Upper segment
    ctx.fillRect(35, -23 + wave4, 8, 7); // Curling segment
    ctx.fillRect(32, -28 + wave4, 7, 5); // Upper curl
    ctx.fillRect(30, -31 + wave4, 5, 3); // Tip
    // Suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(42, -4 + wave4, 5, 5);
    ctx.fillRect(42, 4 + wave4, 5, 5);
    ctx.fillRect(42, 12 + wave4, 5, 5);
    ctx.fillRect(42, 20 + wave4, 5, 5);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(45, -6 + wave4, 3, 12);

    // === NEAR RIGHT TENTACLE (Wrapping over boat) - CLOSER BUT DIFFERENT ANGLE ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(22, -1 + wave6, 8, 26); // Different height and length
    ctx.fillRect(20, -9 + wave6, 8, 8); // Upper segment
    ctx.fillRect(17, -14 + wave6, 7, 5); // Curling segment
    ctx.fillRect(15, -17 + wave6, 5, 3); // Tip
    // Curling over boat rail (different position)
    ctx.fillRect(13, 25, 7, 5);
    ctx.fillRect(11, 28, 5, 4);
    // Suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(25, 2 + wave6, 4, 4);
    ctx.fillRect(25, 9 + wave6, 4, 4);
    ctx.fillRect(25, 16 + wave6, 4, 4);
    ctx.fillRect(25, 23 + wave6, 4, 4);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(26, 1 + wave6, 3, 10);

    // === BACK CENTER-LEFT TENTACLE (from behind boat) ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(-12, -20 + wave7, 8, 33);
    ctx.fillRect(-10, -28 + wave7, 8, 8);
    ctx.fillRect(-8, -34 + wave7, 7, 6);
    ctx.fillRect(-6, -38 + wave7, 5, 4);
    // Suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(-11, -16 + wave7, 4, 4);
    ctx.fillRect(-11, -9 + wave7, 4, 4);
    ctx.fillRect(-11, -2 + wave7, 4, 4);
    ctx.fillRect(-11, 5 + wave7, 4, 4);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(-11, -18 + wave7, 3, 12);

    // === BACK CENTER-RIGHT TENTACLE (from behind boat) - SHIFTED ===
    ctx.fillStyle = krakenColor;
    ctx.fillRect(6, -18 + wave8, 8, 31); // Different starting position and height
    ctx.fillRect(4, -26 + wave8, 8, 8);
    ctx.fillRect(3, -32 + wave8, 7, 6);
    ctx.fillRect(2, -36 + wave8, 5, 4);
    // Suction cups
    ctx.fillStyle = suckerColor;
    ctx.fillRect(9, -14 + wave8, 4, 4);
    ctx.fillRect(9, -7 + wave8, 4, 4);
    ctx.fillRect(9, 0 + wave8, 4, 4);
    ctx.fillRect(9, 7 + wave8, 4, 4);
    // Highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(10, -16 + wave8, 3, 12);

    // Water splash/foam effects (where tentacles emerge)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    // Left splashes
    ctx.fillRect(-60, 23, 6, 4);
    ctx.fillRect(-56, 26, 5, 3);
    // Mid left
    ctx.fillRect(-41, 23, 5, 4);
    ctx.fillRect(-38, 26, 4, 3);
    // Near left
    ctx.fillRect(-23, 27, 5, 3);
    // Far right (adjusted)
    ctx.fillRect(58, 24, 6, 4);
    ctx.fillRect(54, 27, 5, 3);
    // Mid right (adjusted)
    ctx.fillRect(40, 22, 5, 4);
    ctx.fillRect(37, 25, 4, 3);
    // Near right (adjusted)
    ctx.fillRect(22, 26, 5, 3);
    // Center splashes
    ctx.fillRect(-10, 12, 4, 3);
    ctx.fillRect(8, 12, 4, 3);

    // Bubbles rising from deep water (multiple streams)
    const bubbleOffset = (time * 0.025) % 22;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    // Left bubbles
    ctx.fillRect(-58, 20 - bubbleOffset, 3, 3);
    ctx.fillRect(-60, 16 - bubbleOffset, 2, 2);
    ctx.fillRect(-39, 18 - bubbleOffset, 3, 3);
    ctx.fillRect(-41, 14 - bubbleOffset, 2, 2);
    // Right bubbles (adjusted positions)
    ctx.fillRect(60, 21 - bubbleOffset, 3, 3);
    ctx.fillRect(62, 17 - bubbleOffset, 2, 2);
    ctx.fillRect(41, 19 - bubbleOffset, 3, 3);
    ctx.fillRect(43, 15 - bubbleOffset, 2, 2);
    // Center bubbles
    ctx.fillRect(-8, 10 - bubbleOffset, 2, 2);
    ctx.fillRect(8, 10 - bubbleOffset, 2, 2);
  } else if (petId === "gentleman_octopus") {
    // --- GENTLEMAN OCTOPUS (Sophisticated octopus with top hat, monocle, cane) ---
    ctx.translate(0, bob);

    // Color scheme: Refined red/orange octopus with black accessories
    const octoColor = "#d84315"; // Burnt orange/red
    const darkColor = "#bf360c"; // Darker shade

    // Main body/head (rounded dome)
    ctx.fillStyle = octoColor;
    ctx.fillRect(-8, -20, 16, 12);
    ctx.fillRect(-10, -16, 20, 8);
    ctx.fillRect(-6, -22, 12, 2);

    // Top Hat (Black, tall)
    ctx.fillStyle = "#212121"; // Black hat
    ctx.fillRect(-8, -34, 16, 12); // Tall crown
    ctx.fillRect(-10, -36, 20, 2); // Top brim
    ctx.fillRect(-12, -24, 24, 4); // Bottom brim (wider)
    // Hat band (Red)
    ctx.fillStyle = "#c62828";
    ctx.fillRect(-8, -25, 16, 2);

    // Eyes (Large, refined)
    ctx.fillStyle = "white";
    ctx.fillRect(-6, -16, 5, 5); // Left eye white
    ctx.fillRect(1, -16, 5, 5); // Right eye white
    // Pupils
    ctx.fillStyle = "black";
    ctx.fillRect(-5, -15, 3, 3);
    ctx.fillRect(2, -15, 3, 3);

    // Monocle (on right eye)
    ctx.strokeStyle = "#ffd700"; // Gold monocle
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(3.5, -13.5, 4.5, 0, Math.PI * 2);
    ctx.stroke();
    // Monocle chain
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(7, -13, 1, 6);
    ctx.fillRect(8, -7, 2, 1);

    // Mustache (Curly, sophisticated)
    ctx.fillStyle = "#212121";
    ctx.fillRect(-8, -12, 4, 2); // Left side
    ctx.fillRect(-9, -13, 2, 2); // Left curl
    ctx.fillRect(4, -12, 4, 2); // Right side
    ctx.fillRect(7, -13, 2, 2); // Right curl

    // Bow tie (Red)
    ctx.fillStyle = "#c62828";
    ctx.fillRect(-3, -8, 6, 3);
    ctx.fillRect(-5, -9, 2, 5); // Left wing
    ctx.fillRect(3, -9, 2, 5); // Right wing

    // Tentacles (8 total, properly connected to body bottom, MORE SPREAD OUT)
    const tentacleWave = Math.sin(time * 0.006) * 2;
    const bodyBottom = -8; // Bottom of the head where tentacles connect

    // Back tentacles (4, smaller, behind the main body) - MORE SPREAD
    ctx.fillStyle = darkColor;
    // Back far left
    ctx.fillRect(-13, bodyBottom, 3, 12 + tentacleWave);
    ctx.fillRect(-14, bodyBottom + 12 + tentacleWave, 3, 4);
    ctx.fillRect(-15, bodyBottom + 16 + tentacleWave, 2, 3);

    // Back mid left
    ctx.fillRect(-8, bodyBottom, 3, 10 - tentacleWave);
    ctx.fillRect(-9, bodyBottom + 10 - tentacleWave, 3, 4);
    ctx.fillRect(-10, bodyBottom + 14 - tentacleWave, 2, 3);

    // Back mid right
    ctx.fillRect(5, bodyBottom, 3, 10 + tentacleWave);
    ctx.fillRect(4, bodyBottom + 10 + tentacleWave, 3, 4);
    ctx.fillRect(3, bodyBottom + 14 + tentacleWave, 2, 3);

    // Back far right
    ctx.fillRect(10, bodyBottom, 3, 12 - tentacleWave);
    ctx.fillRect(9, bodyBottom + 12 - tentacleWave, 3, 4);
    ctx.fillRect(8, bodyBottom + 16 - tentacleWave, 2, 3);

    // Front tentacles (4, more prominent, properly connected) - MORE SPREAD
    ctx.fillStyle = octoColor;

    // Front far left (widest spread)
    ctx.fillRect(-11, bodyBottom, 3, 14);
    ctx.fillRect(-12, bodyBottom + 14, 3, 4);
    ctx.fillRect(-13, bodyBottom + 18, 2, 3);
    // Suction cups
    ctx.fillStyle = darkColor;
    ctx.fillRect(-10, bodyBottom + 2, 2, 2);
    ctx.fillRect(-10, bodyBottom + 6, 2, 2);
    ctx.fillRect(-10, bodyBottom + 10, 2, 2);

    // Front mid left
    ctx.fillStyle = octoColor;
    ctx.fillRect(-5, bodyBottom, 3, 12);
    ctx.fillRect(-6, bodyBottom + 12, 3, 4);
    ctx.fillRect(-7, bodyBottom + 16, 2, 3);
    // Suction cups
    ctx.fillStyle = darkColor;
    ctx.fillRect(-4, bodyBottom + 2, 2, 2);
    ctx.fillRect(-4, bodyBottom + 6, 2, 2);
    ctx.fillRect(-4, bodyBottom + 10, 2, 2);

    // Front mid right
    ctx.fillStyle = octoColor;
    ctx.fillRect(2, bodyBottom, 3, 12);
    ctx.fillRect(1, bodyBottom + 12, 3, 4);
    ctx.fillRect(0, bodyBottom + 16, 2, 3);
    // Suction cups
    ctx.fillStyle = darkColor;
    ctx.fillRect(2, bodyBottom + 2, 2, 2);
    ctx.fillRect(2, bodyBottom + 6, 2, 2);
    ctx.fillRect(2, bodyBottom + 10, 2, 2);

    // Front far right (HOLDING CANE, widest spread)
    ctx.fillStyle = octoColor;
    ctx.fillRect(8, bodyBottom, 3, 14);
    ctx.fillRect(7, bodyBottom + 14, 3, 4);
    // Tentacle wraps around cane
    ctx.fillRect(6, bodyBottom + 18, 2, 3);
    // Suction cups
    ctx.fillStyle = darkColor;
    ctx.fillRect(8, bodyBottom + 2, 2, 2);
    ctx.fillRect(8, bodyBottom + 6, 2, 2);
    ctx.fillRect(8, bodyBottom + 10, 2, 2);

    // Walking Cane (Elegant, dark wood with gold handle)
    // Positioned next to the far right tentacle
    // Cane shaft (dark brown)
    ctx.fillStyle = "#4e342e";
    ctx.fillRect(11, bodyBottom + 2, 2, 24);
    // Cane tip (metal ferrule)
    ctx.fillStyle = "#90a4ae";
    ctx.fillRect(11, bodyBottom + 26, 2, 2);
    // Cane handle (curved, gold)
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(11, bodyBottom, 4, 2); // Horizontal part
    ctx.fillRect(13, bodyBottom - 2, 2, 4); // Vertical curve
    ctx.fillRect(11, bodyBottom - 4, 4, 2); // Top curve
    // Gold handle detail
    ctx.fillRect(12, bodyBottom - 3, 2, 1);
  } else {
    // --- EXISTING LIVING ANIMALS (Parrot, Cat, Dog) ---
    ctx.translate(0, bob);

    if (petId === "parrot") {
      // --- PARROT ---
      // Green body
      ctx.fillStyle = "#43a047";
      ctx.fillRect(0, -12, 10, 12);

      // Red Wing
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(2, -8, 6, 6);

      // Yellow Head/Neck
      ctx.fillStyle = "#fdd835";
      ctx.fillRect(2, -16, 8, 6);

      // Beak (Grey)
      ctx.fillStyle = "#616161";
      ctx.fillRect(8, -14, 4, 3);

      // Eye
      ctx.fillStyle = "black";
      ctx.fillRect(6, -14, 2, 2);

      // Tail
      ctx.fillStyle = "#1976d2"; // Blue tail
      ctx.fillRect(-4, -6, 4, 2);
      ctx.fillRect(-6, -4, 6, 2);

      // Legs
      ctx.fillStyle = "#f57f17";
      ctx.fillRect(2, 0, 2, 2);
      ctx.fillRect(6, 0, 2, 2);
    } else if (petId === "cat") {
      // --- CAT ---
      // Orange Tabby
      ctx.fillStyle = "#fb8c00";
      // Body (Sitting)
      ctx.fillRect(0, -10, 12, 10);

      // Head
      ctx.fillRect(2, -16, 10, 8);

      // Ears
      ctx.fillStyle = "#e65100";
      ctx.beginPath();
      ctx.moveTo(3, -16);
      ctx.lineTo(5, -19);
      ctx.lineTo(7, -16); // Left
      ctx.moveTo(8, -16);
      ctx.lineTo(10, -19);
      ctx.lineTo(12, -16); // Right
      ctx.fill();

      // White Chest
      ctx.fillStyle = "#fff3e0";
      ctx.fillRect(2, -8, 4, 6);

      // Tail (Up)
      ctx.fillStyle = "#fb8c00";
      ctx.fillRect(-2, -8, 2, 8);
      ctx.fillRect(-4, -10, 2, 4);

      // Eyes
      ctx.fillStyle = "#1b5e20"; // Green eyes
      ctx.fillRect(4, -13, 2, 2);
      ctx.fillRect(9, -13, 2, 2);
    } else if (petId === "dog") {
      // --- DOG ---
      // Brown Dog (Sitting)
      ctx.fillStyle = "#8d6e63";

      // Body
      ctx.fillRect(0, -12, 14, 12);

      // Head
      ctx.fillRect(4, -18, 10, 8);

      // Ears (Floppy)
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(2, -16, 4, 6); // Left ear flap
      ctx.fillRect(12, -16, 4, 6); // Right ear flap

      // Snout
      ctx.fillStyle = "#d7ccc8";
      ctx.fillRect(12, -14, 4, 4);

      // Nose
      ctx.fillStyle = "black";
      ctx.fillRect(15, -14, 2, 2);

      // Eyes
      ctx.fillStyle = "black";
      ctx.fillRect(6, -15, 2, 2);
      ctx.fillRect(10, -15, 2, 2);

      // Tail (Wagging)
      const tailWag = Math.sin(time * 0.015) * 4;
      ctx.fillStyle = "#8d6e63";
      ctx.save();
      ctx.translate(-2, -4);
      ctx.rotate(tailWag * 0.1);
      ctx.fillRect(-4, -2, 6, 2);
      ctx.restore();
    }
  }

  ctx.restore();
};
