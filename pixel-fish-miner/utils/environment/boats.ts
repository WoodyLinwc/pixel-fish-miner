/**
 * Background boats rendering (parallax effect)
 */

export interface BackgroundBoat {
  x: number;
  y: number;
  vx: number;
  type: "SMALL" | "BIG" | "GHOST";
  color: number;
  scale: number;
  opacity?: number; // For ghost boat fade in/out effect
}

/**
 * Draw a single background boat
 */
const drawBoat = (
  ctx: CanvasRenderingContext2D,
  boat: BackgroundBoat,
  visualTime: number,
) => {
  ctx.save();
  ctx.translate(boat.x, boat.y);

  // Use stored scale for variety
  const scale = boat.scale || 0.6;
  ctx.scale(scale, scale);

  if (boat.vx < 0) ctx.scale(-1, 1); // Flip if moving left

  if (boat.type === "SMALL") {
    // Sailboat
    // Hull
    ctx.fillStyle = "#5d4037";
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(10, 6);
    ctx.lineTo(-10, 6);
    ctx.fill();
    // Mast
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(-2, -20, 2, 20);
    // Sail
    ctx.fillStyle = "#eceff1";
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, -4);
    ctx.lineTo(0, -4);
    ctx.fill();
  } else if (boat.type === "BIG") {
    // Big Ship (Cargo)
    // Hull
    ctx.fillStyle = "#37474f"; // Dark BlueGrey
    ctx.fillRect(-40, -4, 80, 10);
    ctx.fillStyle = "#b71c1c"; // Red bottom line (water line)
    ctx.fillRect(-40, 2, 80, 4);

    // Bridge
    ctx.fillStyle = "#cfd8dc"; // White/Grey upper
    ctx.fillRect(10, -14, 20, 10);
    // Windows
    ctx.fillStyle = "#263238";
    ctx.fillRect(14, -10, 12, 2);

    // Cargo Containers
    // Fixed colored containers for stability
    ctx.fillStyle = "#ef5350";
    ctx.fillRect(-20, -10, 10, 6);
    ctx.fillStyle = "#42a5f5";
    ctx.fillRect(-8, -10, 10, 6);

    // Smoke (animated)
    if (Math.floor(visualTime / 200) % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(20, -18, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (boat.type === "GHOST") {
    // Ghost Boat: The Flying Dutchman - Legendary cursed ship (若隐若现)
    // Calculate opacity for fade in/out effect - DRAMATIC APPEARANCE
    const fadeSpeed = 0.0008; // Slow dramatic cycle
    const fadePhase = (visualTime * fadeSpeed) % (Math.PI * 2);
    const opacity = 0.5 + Math.sin(fadePhase) * 0.5; // Oscillates between 0.0 and 1.0

    // Apply global opacity
    ctx.globalAlpha = opacity;

    // HULL - Large weathered galleon with barnacles
    ctx.fillStyle = "rgba(25, 35, 45, 0.9)"; // Very dark, rotted wood
    // Main hull (larger, more imposing)
    ctx.beginPath();
    ctx.moveTo(-35, 2);
    ctx.lineTo(-30, -2);
    ctx.lineTo(30, -2);
    ctx.lineTo(35, 2);
    ctx.lineTo(32, 10);
    ctx.lineTo(-32, 10);
    ctx.closePath();
    ctx.fill();

    // Hull outline
    ctx.strokeStyle = "rgba(15, 25, 35, 0.95)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Deck planks
    ctx.strokeStyle = "rgba(35, 45, 55, 0.8)";
    ctx.lineWidth = 1;
    for (let i = -30; i < 30; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 2);
      ctx.lineTo(i + 6, 2);
      ctx.stroke();
    }

    // Barnacles and rot on hull
    ctx.fillStyle = "rgba(50, 70, 60, 0.85)";
    ctx.fillRect(-28, 5, 4, 3);
    ctx.fillRect(-15, 7, 5, 2);
    ctx.fillRect(0, 6, 3, 3);
    ctx.fillRect(15, 8, 4, 2);
    ctx.fillRect(25, 6, 3, 3);

    // Hull damage/holes
    ctx.fillStyle = "rgba(10, 15, 20, 0.9)";
    ctx.fillRect(-20, 3, 3, 5);
    ctx.fillRect(8, 4, 4, 4);
    ctx.fillRect(22, 5, 2, 3);

    // BOW (front of ship) - Broken figurehead
    ctx.fillStyle = "rgba(30, 40, 50, 0.85)";
    ctx.beginPath();
    ctx.moveTo(35, 2);
    ctx.lineTo(42, 0);
    ctx.lineTo(40, 6);
    ctx.lineTo(35, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(20, 30, 40, 0.9)";
    ctx.stroke();

    // MAIN MAST (center) - Broken and tilted
    ctx.fillStyle = "rgba(30, 40, 50, 0.9)";
    ctx.save();
    ctx.translate(5, -8);
    ctx.rotate(-0.1); // Slight lean
    ctx.fillRect(-3, -35, 4, 40);
    // Mast cracks
    ctx.fillStyle = "rgba(15, 25, 35, 0.95)";
    ctx.fillRect(-2, -25, 3, 2);
    ctx.fillRect(-1, -15, 2, 3);
    ctx.strokeStyle = "rgba(20, 30, 40, 0.95)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-3, -35, 4, 40);
    ctx.restore();

    // FORE MAST (front) - Shorter, more broken
    ctx.fillStyle = "rgba(35, 45, 55, 0.85)";
    ctx.save();
    ctx.translate(-15, -5);
    ctx.rotate(0.12); // Tilted forward
    ctx.fillRect(-2, -25, 3, 28);
    ctx.strokeStyle = "rgba(25, 35, 45, 0.9)";
    ctx.lineWidth = 1;
    ctx.strokeRect(-2, -25, 3, 28);
    ctx.restore();

    // TATTERED SAILS - Simplified torn sails
    // Main sail (center) - Simple rectangular torn sail
    ctx.fillStyle = "rgba(130, 140, 150, 0.75)";
    ctx.fillRect(2, -35, 16, 25);

    // Sail outline
    ctx.strokeStyle = "rgba(90, 100, 110, 0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(2, -35, 16, 25);

    // Simple tears in main sail
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(6, -30, 3, 5);
    ctx.fillRect(10, -22, 2, 4);
    ctx.fillRect(8, -15, 2, 3);

    // Fore sail (front) - Smaller simple sail
    ctx.fillStyle = "rgba(120, 130, 140, 0.7)";
    ctx.fillRect(-17, -25, 10, 18);

    ctx.strokeStyle = "rgba(80, 90, 100, 0.75)";
    ctx.strokeRect(-17, -25, 10, 18);

    // Tears in fore sail
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(-14, -20, 2, 4);
    ctx.fillRect(-10, -14, 2, 3);

    // CURSED GREEN GLOW - Emanating from the entire ship
    const glowPulse = Math.sin(visualTime * 0.005) * 0.4 + 0.6;

    // Ghostly green aura around entire ship
    ctx.fillStyle = `rgba(50, 255, 100, ${glowPulse * 0.15})`;
    ctx.fillRect(-40, -45, 85, 60);

    // SPECTRAL LANTERNS (multiple glowing points)
    // Front lantern (brightest)
    ctx.fillStyle = "rgba(20, 30, 35, 0.95)";
    ctx.fillRect(28, -5, 6, 6);

    ctx.fillStyle = `rgba(50, 255, 100, ${glowPulse * 0.6})`;
    ctx.beginPath();
    ctx.arc(31, -2, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(150, 255, 180, ${glowPulse * 0.85})`;
    ctx.beginPath();
    ctx.arc(31, -2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(230, 255, 240, ${glowPulse})`;
    ctx.fillRect(30, -4, 2, 3);

    // Mid-ship lantern
    ctx.fillStyle = "rgba(20, 30, 35, 0.9)";
    ctx.fillRect(-5, -8, 5, 5);

    ctx.fillStyle = `rgba(80, 255, 120, ${glowPulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(-2.5, -5.5, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(180, 255, 200, ${glowPulse * 0.75})`;
    ctx.fillRect(-4, -7, 2, 3);

    // Light rays from main lantern
    ctx.strokeStyle = `rgba(100, 255, 150, ${glowPulse * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(31, -2);
    ctx.lineTo(45, -8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(31, -2);
    ctx.lineTo(43, 5);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(31, -2);
    ctx.lineTo(44, 0);
    ctx.stroke();

    // GHOSTLY RIGGING AND ROPES (many broken lines)
    ctx.strokeStyle = "rgba(90, 110, 120, 0.7)";
    ctx.lineWidth = 1.5;
    // Main mast rigging
    ctx.beginPath();
    ctx.moveTo(5, -40);
    ctx.lineTo(-25, 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -40);
    ctx.lineTo(25, 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -30);
    ctx.lineTo(-15, 2);
    ctx.stroke();

    // Hanging broken ropes
    ctx.strokeStyle = "rgba(80, 100, 110, 0.65)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(5, -20);
    ctx.lineTo(10, -5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, -15);
    ctx.lineTo(-18, -3);
    ctx.stroke();

    // SPECTRAL MIST - Eerie fog around ship
    ctx.fillStyle = `rgba(100, 200, 150, ${0.35 * glowPulse})`;
    const mistOffset1 = Math.sin(visualTime * 0.002 + boat.x * 0.01) * 5;
    const mistOffset2 = Math.cos(visualTime * 0.0025 + boat.x * 0.015) * 4;
    ctx.fillRect(-40 + mistOffset1, 3, 12, 6);
    ctx.fillRect(30 + mistOffset2, 4, 10, 5);
    ctx.fillRect(-10 + mistOffset1, -5, 8, 4);
    ctx.fillRect(15 + mistOffset2, -3, 7, 4);

    // SKULL DECORATION (on sail or hull) - Flying Dutchman signature
    ctx.fillStyle = `rgba(200, 220, 210, ${0.8 * opacity})`;
    // Skull on main sail
    ctx.beginPath();
    ctx.arc(10, -25, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(9.5, -23, 1, 2);
    // Eye sockets (glowing green)
    ctx.fillStyle = `rgba(100, 255, 150, ${glowPulse * 0.9})`;
    ctx.fillRect(9, -26, 1, 1);
    ctx.fillRect(11, -26, 1, 1);

    // Reset global alpha
    ctx.globalAlpha = 1.0;
  }
  ctx.restore();
};

/**
 * Draw all background boats
 */
export const drawBackgroundBoats = (
  ctx: CanvasRenderingContext2D,
  boats: BackgroundBoat[],
  visualTime: number,
) => {
  boats.forEach((boat) => {
    drawBoat(ctx, boat, visualTime);
  });
};
