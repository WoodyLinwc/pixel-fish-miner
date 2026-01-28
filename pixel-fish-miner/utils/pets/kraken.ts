/**
 * Kraken Pet
 * Massive sea monster with ONLY tentacles visible (no body)
 * Features 8 enormous tentacles (15-12px thick) wrapping around boat from all directions
 * with animated wave motion, large suction cups, highlights, and water effects
 */
export const drawKraken = (ctx: CanvasRenderingContext2D, time: number) => {
  // Lower position at water level
  ctx.translate(0, 4);

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

  // === FAR LEFT TENTACLE (MASSIVE - 15px wide) ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(-65, -15 + wave1, 15, 40); // Main massive segment
  ctx.fillRect(-62, -24 + wave1, 15, 9); // Upper segment
  ctx.fillRect(-58, -32 + wave1, 14, 8); // Curling segment
  ctx.fillRect(-52, -38 + wave1, 12, 6); // Upper curl
  ctx.fillRect(-46, -42 + wave1, 9, 4); // Tip
  // Large suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(-62, -10 + wave1, 8, 8);
  ctx.fillRect(-62, -2 + wave1, 8, 8);
  ctx.fillRect(-62, 6 + wave1, 8, 8);
  ctx.fillRect(-62, 14 + wave1, 8, 8);
  ctx.fillRect(-62, 22 + wave1, 8, 8);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(-63, -12 + wave1, 5, 15);

  // === MID LEFT TENTACLE (THICK - 14px wide) ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(-45, -10 + wave2, 14, 35);
  ctx.fillRect(-43, -18 + wave2, 14, 8);
  ctx.fillRect(-40, -25 + wave2, 12, 7);
  ctx.fillRect(-36, -30 + wave2, 11, 5);
  ctx.fillRect(-32, -33 + wave2, 8, 3);
  // Suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(-43, -6 + wave2, 8, 8);
  ctx.fillRect(-43, 2 + wave2, 8, 8);
  ctx.fillRect(-43, 10 + wave2, 8, 8);
  ctx.fillRect(-43, 18 + wave2, 8, 8);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(-44, -8 + wave2, 5, 12);

  // === NEAR LEFT TENTACLE (Wrapping over boat - 12px wide) ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(-26, -3 + wave5, 12, 28);
  ctx.fillRect(-24, -10 + wave5, 12, 7);
  ctx.fillRect(-21, -15 + wave5, 11, 5);
  ctx.fillRect(-18, -18 + wave5, 8, 3);
  // Curling over boat rail
  ctx.fillRect(-17, 25, 11, 6);
  ctx.fillRect(-14, 29, 8, 4);
  // Suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(-25, 0 + wave5, 6, 6);
  ctx.fillRect(-25, 7 + wave5, 6, 6);
  ctx.fillRect(-25, 14 + wave5, 6, 6);
  ctx.fillRect(-25, 21 + wave5, 6, 6);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(-25, -1 + wave5, 5, 10);

  // === FAR RIGHT TENTACLE (MASSIVE - 15px wide) - MORE SPREAD ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(60, -12 + wave3, 15, 38); // Further right, different height
  ctx.fillRect(57, -22 + wave3, 15, 10); // Upper segment
  ctx.fillRect(53, -30 + wave3, 14, 8); // Curling segment
  ctx.fillRect(48, -36 + wave3, 12, 6); // Upper curl
  ctx.fillRect(43, -40 + wave3, 9, 4); // Tip
  // Large suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(62, -8 + wave3, 8, 8);
  ctx.fillRect(62, 0 + wave3, 8, 8);
  ctx.fillRect(62, 8 + wave3, 8, 8);
  ctx.fillRect(62, 16 + wave3, 8, 8);
  ctx.fillRect(62, 24 + wave3, 8, 8);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(65, -10 + wave3, 5, 15);

  // === MID RIGHT TENTACLE (THICK - 14px wide) - IRREGULAR POSITION ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(40, -7 + wave4, 14, 32); // Different starting height
  ctx.fillRect(38, -16 + wave4, 14, 9); // Upper segment
  ctx.fillRect(35, -23 + wave4, 12, 7); // Curling segment
  ctx.fillRect(32, -28 + wave4, 11, 5); // Upper curl
  ctx.fillRect(30, -31 + wave4, 8, 3); // Tip
  // Suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(42, -4 + wave4, 8, 8);
  ctx.fillRect(42, 4 + wave4, 8, 8);
  ctx.fillRect(42, 12 + wave4, 8, 8);
  ctx.fillRect(42, 20 + wave4, 8, 8);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(45, -6 + wave4, 5, 12);

  // === NEAR RIGHT TENTACLE (Wrapping over boat - 12px wide) - CLOSER BUT DIFFERENT ANGLE ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(22, -1 + wave6, 12, 26); // Different height and length
  ctx.fillRect(20, -9 + wave6, 12, 8); // Upper segment
  ctx.fillRect(17, -14 + wave6, 11, 5); // Curling segment
  ctx.fillRect(15, -17 + wave6, 8, 3); // Tip
  // Curling over boat rail (different position)
  ctx.fillRect(13, 25, 11, 5);
  ctx.fillRect(11, 28, 8, 4);
  // Suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(25, 2 + wave6, 6, 6);
  ctx.fillRect(25, 9 + wave6, 6, 6);
  ctx.fillRect(25, 16 + wave6, 6, 6);
  ctx.fillRect(25, 23 + wave6, 6, 6);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(26, 1 + wave6, 5, 10);

  // === BACK CENTER-LEFT TENTACLE (from behind boat - 12px wide) ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(-12, -20 + wave7, 12, 33);
  ctx.fillRect(-10, -28 + wave7, 12, 8);
  ctx.fillRect(-8, -34 + wave7, 11, 6);
  ctx.fillRect(-6, -38 + wave7, 8, 4);
  // Suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(-11, -16 + wave7, 6, 6);
  ctx.fillRect(-11, -9 + wave7, 6, 6);
  ctx.fillRect(-11, -2 + wave7, 6, 6);
  ctx.fillRect(-11, 5 + wave7, 6, 6);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(-11, -18 + wave7, 5, 12);

  // === BACK CENTER-RIGHT TENTACLE (from behind boat - 12px wide) - SHIFTED ===
  ctx.fillStyle = krakenColor;
  ctx.fillRect(6, -18 + wave8, 12, 31); // Different starting position and height
  ctx.fillRect(4, -26 + wave8, 12, 8);
  ctx.fillRect(3, -32 + wave8, 11, 6);
  ctx.fillRect(2, -36 + wave8, 8, 4);
  // Suction cups
  ctx.fillStyle = suckerColor;
  ctx.fillRect(9, -14 + wave8, 6, 6);
  ctx.fillRect(9, -7 + wave8, 6, 6);
  ctx.fillRect(9, 0 + wave8, 6, 6);
  ctx.fillRect(9, 7 + wave8, 6, 6);
  // Highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(10, -16 + wave8, 5, 12);

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
};
