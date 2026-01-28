/**
 * Goldfish Tank Pet
 * Features glass tank with water, plants, swimming goldfish, and bubbles
 */
export const drawGoldfish = (ctx: CanvasRenderingContext2D, time: number) => {
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
};
