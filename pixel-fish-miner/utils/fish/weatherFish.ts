
import { EntityFish } from '../../types';

export const drawThunderEel = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Electric Eel: Yellow continuous snake-like body
    ctx.fillStyle = '#fdd835'; // Bright Yellow

    // Draw a sinuous/jagged body shape using a single path
    ctx.beginPath();
    // Nose (Right side)
    ctx.moveTo(w/2, 0); 
    // Top Head Slope
    ctx.lineTo(w/2 - 10, -h/2); 
    // Top Body Line (wavy)
    ctx.lineTo(0, -h/2 + 2); 
    ctx.lineTo(-w/2, -h/2);
    // Tail Tip
    ctx.lineTo(-w/2 - 8, 0);
    // Bottom Body Line
    ctx.lineTo(-w/2, h/2);
    ctx.lineTo(0, h/2 - 2);
    ctx.lineTo(w/2 - 10, h/2);
    // Close shape at Nose
    ctx.closePath();
    ctx.fill();

    // Eye (White Sclera)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/2 - 8, -5, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/2 - 6, -4, 2, 2);

    // Electric Bolt Pattern (Continuous line along the body)
    ctx.fillStyle = '#fff9c4'; // Light yellow
    ctx.beginPath();
    ctx.moveTo(w/3, 0);
    ctx.lineTo(w/6, -3);
    ctx.lineTo(0, 3);
    ctx.lineTo(-w/6, -3);
    ctx.lineTo(-w/3, 3);
    ctx.lineTo(-w/2, 0);
    ctx.lineTo(-w/3, -3);
    ctx.lineTo(-w/6, 3);
    ctx.lineTo(0, -3);
    ctx.lineTo(w/6, 3);
    ctx.closePath();
    ctx.fill();

    // Sparks
    if (Math.random() > 0.4) {
        ctx.fillStyle = '#e0f7fa';
        ctx.fillRect(w/2 + 2, -5, 2, 2); // Spark near head
        ctx.fillRect(-w/2 - 2, 2, 2, 2); // Spark near tail
        
        // Random spark on body
        const rx = (Math.random() - 0.5) * w;
        const ry = (Math.random() - 0.5) * h;
        ctx.fillRect(rx, ry, 2, 2);
    }
};

export const drawIceFin = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Ice Fin: Crystal Fish (Shard with Tail)
    ctx.fillStyle = 'rgba(178, 235, 242, 0.9)'; // Ice Body

    // Body: Crystal Hexagon/Diamond shape
    ctx.beginPath();
    ctx.moveTo(w/2, 0); // Nose
    ctx.lineTo(w/4, -h/2); // Top Head
    ctx.lineTo(-w/4, -h/2); // Top Back
    ctx.lineTo(-w/2, 0); // Tail Base
    ctx.lineTo(-w/4, h/2); // Bottom Back
    ctx.lineTo(w/4, h/2); // Bottom Head
    ctx.closePath();
    ctx.fill();
    
    // Inner Facets
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(-w/2, 0);
    ctx.lineTo(0, h/2);
    ctx.fill();

    // Tail: Crystalline structure
    ctx.fillStyle = 'rgba(178, 235, 242, 0.9)';
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 15, -h/3); // Top Tail Tip
    ctx.lineTo(-w/2 - 5, 0); // Center notch
    ctx.lineTo(-w/2 - 15, h/3); // Bottom Tail Tip
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/4, -5, 4, 4);
    ctx.fillStyle = '#006064';
    ctx.fillRect(w/4 + 1, -4, 2, 2);

    // EFFECT: Glint / Sparkle
    if (Math.random() > 0.7) {
        ctx.fillStyle = 'white';
        const gx = (Math.random() - 0.5) * w * 0.8;
        const gy = (Math.random() - 0.5) * h * 0.8;
        // Cross shape sparkle
        ctx.fillRect(gx, gy - 3, 2, 8); // Vertical
        ctx.fillRect(gx - 3, gy, 8, 2); // Horizontal
    }
};

export const drawWindRay = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Wind Ray: Pixel Style (Solid fills, blocky shapes)
    ctx.fillStyle = '#b0bec5'; // Blue-grey Body

    // Diamond Body
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(0, -h/2);
    ctx.lineTo(-w/2, 0);
    ctx.lineTo(0, h/2);
    ctx.fill();

    // Detail: Darker grey stripe/pattern on back (Simple triangle blocks)
    ctx.fillStyle = '#78909c';
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(0, -h/4);
    ctx.lineTo(0, h/4);
    ctx.fill();

    // Eyes: Slightly wider apart
    ctx.fillStyle = 'white';
    ctx.fillRect(w/8, -10, 4, 4); // Top
    ctx.fillRect(w/8, 6, 4, 4); // Bottom

    // Pupils
    ctx.fillStyle = 'black';
    ctx.fillRect(w/8 + 2, -9, 2, 2);
    ctx.fillRect(w/8 + 2, 7, 2, 2);

    // Tail: Rectangle shaft + Blocky Arrow Tip
    ctx.fillStyle = '#546e7a';
    // Shaft
    ctx.fillRect(-w * 1.2, -2, w * 0.7, 4);
    
    // Arrow Tip (Blocky)
    ctx.beginPath();
    ctx.moveTo(-w * 1.2, 0); // Tip
    ctx.lineTo(-w * 1.2 + 8, -6);
    ctx.lineTo(-w * 1.2 + 8, 6);
    ctx.fill();

    // EFFECT: Wind Trails / Speed Lines
    if (Math.random() > 0.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            // Random trail behind
            const len = 5 + Math.random() * 15;
            const yOffset = (Math.random() - 0.5) * h;
            ctx.fillRect(-w/2 - len - 5, yOffset, len, 2);
    }
};

export const drawSeaTurtle = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, entity: EntityFish) => {
    // Sea Turtle: Side view, blocky rectangles
    
    // Head
    ctx.fillStyle = '#a5d6a7';
    ctx.fillRect(w/2, -h/4 - 2, 9, 9);
    
    // Eye
    ctx.fillStyle = 'black';
    ctx.fillRect(w/2 + 5, -h/4, 2, 2);

    // Shell (Body) - Main Rectangle
    ctx.fillStyle = '#2e7d32'; // Dark Green
    ctx.fillRect(-w/2, -h/2, w, h - 8);
    
    // Shell Highlights
    ctx.fillStyle = '#4caf50'; 
    ctx.fillRect(-w/4, -h/2 + 4, w/2, h/2 - 8);

    // Belly
    ctx.fillStyle = '#fff59d'; // Light Yellow
    ctx.fillRect(-w/2 + 2, h/2 - 10, w - 4, 6);

    // Tail
    ctx.fillStyle = '#a5d6a7';
    ctx.fillRect(-w/2 - 4, 0, 4, 4);

    // Wing Flap Animation
    // Cycle: -1 to 1
    // Only animate if time is provided (non-zero)
    const flapCycle = time ? Math.sin(time * 0.005 + entity.x * 0.1) : 0;
    
    ctx.fillStyle = '#81c784'; // Flipper color

    // Front Flipper - Matches back flipper shape (Rectangle) but larger
    const wingW = 14;
    const wingH = 7;
    const wingX = w/6;
    const wingY = h/2 - 10; // Start near belly level
    
    // Move up and down like a flipper/wing
    const frontOffset = flapCycle * 5; 
    ctx.fillRect(wingX, wingY + frontOffset, wingW, wingH);

    // Back Flipper (Small)
    const backWingX = -w/2 + 8;
    const backWingY = h/2 - 8;
    
    // Move up and down
    const backOffset = flapCycle * 3;
    ctx.fillRect(backWingX, backWingY + backOffset, 8, 4);
};
