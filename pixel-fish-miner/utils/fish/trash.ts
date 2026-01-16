
export const drawOldBoot = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Boot shape (L-shape)
    ctx.fillStyle = '#5d4037'; // Dark brown
    ctx.fillRect(-w/2, -h/2, w/2, h); // Shaft
    ctx.fillRect(-w/2, h/6, w, h/3); // Foot
    // Lace details
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(-w/2 + 2, -h/2 + 4, w/2 - 4, 2);
    ctx.fillRect(-w/2 + 2, -h/2 + 8, w/2 - 4, 2);
};

export const drawRustyCan = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Can Shape
    ctx.fillStyle = '#b0bec5'; // Metal
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.fillStyle = '#ef5350'; // Red label
    ctx.fillRect(-w/2, -h/6, w, h/2);
    // Rust spots
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(-w/4, -h/3, 4, 4);
    ctx.fillRect(w/4, h/4, 3, 3);
};

export const drawPlasticBottle = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Horizontal Bottle
    const capW = 4;
    const neckW = 4;
    const bodyW = w - capW - neckW;
    
    // Cap (Dark Blue)
    ctx.fillStyle = '#0277bd';
    ctx.fillRect(-w/2, -h/4, capW, h/2);
    
    // Neck (Light Blue Transparent)
    ctx.fillStyle = 'rgba(179, 229, 252, 0.9)';
    ctx.fillRect(-w/2 + capW, -h/3, neckW, h/1.5);

    // Body (Light Blue Transparent)
    ctx.fillStyle = 'rgba(225, 245, 254, 0.8)';
    ctx.fillRect(-w/2 + capW + neckW, -h/2, bodyW, h);

    // Label (White)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(-w/2 + capW + neckW + 3, -h/2 + 3, bodyW - 6, h - 6);
};

export const drawStraw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Sharp L-shape straw (Rectangles)
    const thickness = 2;
    
    // Long vertical stem
    ctx.fillStyle = '#f44336'; // Red
    ctx.fillRect(-w/4, -h/2, thickness, h - thickness);
    
    // Short horizontal arm at bottom
    ctx.fillRect(-w/4, h/2 - thickness, w/2 + thickness, thickness);

    // White stripes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    // Two stripes on vertical
    ctx.fillRect(-w/4, -h/4, thickness, 2);
    ctx.fillRect(-w/4, 0, thickness, 2);
    // One stripe on horizontal
    ctx.fillRect(0, h/2 - thickness, 2, thickness);
};
