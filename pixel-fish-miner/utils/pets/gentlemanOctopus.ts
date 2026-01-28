/**
 * Gentleman Octopus Pet
 * Sophisticated octopus with top hat, monocle, bow tie, mustache, and walking cane
 * Features 8 tentacles properly connected to the body, with one tentacle elegantly holding the cane
 */
export const drawGentlemanOctopus = (
  ctx: CanvasRenderingContext2D,
  time: number,
  bob: number,
) => {
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
};
