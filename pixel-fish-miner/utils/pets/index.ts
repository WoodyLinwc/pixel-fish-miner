/**
 * Pet Rendering System
 * Modular pet rendering with individual files for each pet
 */

import { drawGoldfish } from "./goldfish";
import { drawGhostCrab } from "./ghostCrab";
import { drawPenguin } from "./penguin";
import { drawPelican } from "./pelican";
import { drawParrot } from "./parrot";
import { drawCat } from "./cat";
import { drawDog } from "./dog";
import { drawKraken } from "./kraken";
import { drawGentlemanOctopus } from "./gentlemanOctopus";

/**
 * Main pet drawing function - dispatches to specific pet renderers
 * @param ctx - Canvas rendering context
 * @param petId - Identifier for the pet type
 * @param x - X position to render at
 * @param y - Y position to render at
 * @param time - Animation time in milliseconds
 */
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

  // Dispatch to specific pet renderer
  switch (petId) {
    case "goldfish":
      drawGoldfish(ctx, time);
      break;

    case "ghost_crab":
      drawGhostCrab(ctx, time);
      break;

    case "penguin":
      drawPenguin(ctx, time, bob);
      break;

    case "pelican":
      drawPelican(ctx, time, bob);
      break;

    case "parrot":
      drawParrot(ctx, bob);
      break;

    case "cat":
      drawCat(ctx, bob);
      break;

    case "dog":
      drawDog(ctx, time, bob);
      break;

    case "kraken":
      drawKraken(ctx, time);
      break;

    case "gentleman_octopus":
      drawGentlemanOctopus(ctx, time, bob);
      break;

    default:
      // Fallback for unknown pet types
      console.warn(`Unknown pet type: ${petId}`);
      break;
  }

  ctx.restore();
};
