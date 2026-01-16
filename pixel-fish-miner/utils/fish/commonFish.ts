
export const drawSardine = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Silver Sardine: Sleek, silver with blue top
    const silver = '#cfd8dc';
    const darkBlue = '#455a64';
    
    // Body
    ctx.fillStyle = silver;
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Top Stripe
    ctx.fillStyle = darkBlue;
    ctx.fillRect(-w/2, -h/2, w, h/3);
    
    // Tail
    ctx.fillStyle = silver;
    ctx.fillRect(-w/2 - 6, -4, 6, 8); // Smaller tail

    // Eye (White sclera)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -3, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 2, -2, 1, 1);
};

export const drawHerring = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Herring: Similar to Sardine but Blue-Grey and slightly forked tail
    const bodyColor = '#90a4ae'; // Blue Grey
    const stripeColor = '#546e7a'; // Darker
    
    // Body
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Mid-lateral stripe
    ctx.fillStyle = stripeColor;
    ctx.fillRect(-w/2, -1, w - 8, 2);

    // Tail (Forked)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 8, -6);
    ctx.lineTo(-w/2 - 5, 0);
    ctx.lineTo(-w/2 - 8, 6);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -3, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 1, -2, 2, 2);
};

export const drawSmallYellowCroaker = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Pale Yellow body
    ctx.fillStyle = '#fff59d'; 
    ctx.fillRect(-w/2, -h/2, w, h);

    // Darker Yellow top
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(-w/2, -h/2, w, h/3);

    // Fins
    ctx.fillStyle = '#fbc02d';
    // Tail
    ctx.fillRect(-w/2 - 5, -5, 5, 10);
    // Top fin
    ctx.fillRect(-2, -h/2 - 3, 6, 3);

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -3, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 1, -2, 2, 2);
};

export const drawMackerel = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Blue top, silver bottom
    ctx.fillStyle = '#90caf9';
    ctx.fillRect(-w/2, -h/2, w, h/2);
    ctx.fillStyle = '#e3f2fd';
    ctx.fillRect(-w/2, 0, w, h/2);
    
    // Stripes (Dark Blue)
    ctx.fillStyle = '#1565c0';
    for(let i=0; i<3; i++) { // Reduced from 4 to 3 to remove the front-most floating stripe
        ctx.fillRect(-w/4 + i*10, -h/2, 2, h/2);
    }
    
    // Tail (Deep V)
    ctx.fillStyle = '#1565c0';
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 6, -6);
    ctx.lineTo(-w/2 - 6, 6);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -4, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 1, -3, 2, 2);
};

export const drawCod = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Brown/Greenish
    ctx.fillStyle = '#a1887f'; 
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Belly (Lighter)
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(-w/2, h/4, w, h/4);
    
    // Tail
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 8, -7);
    ctx.lineTo(-w/2 - 8, 7);
    ctx.fill();

    // Dorsal Fins (3 distinct fins)
    ctx.fillStyle = '#8d6e63';
    // Front
    ctx.fillRect(2, -h/2 - 4, 6, 4);
    // Middle
    ctx.fillRect(-10, -h/2 - 4, 6, 4);
    // Back
    ctx.fillRect(-20, -h/2 - 3, 5, 3);

    // Pelvic Fin (Moved back)
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, h/2, 4, 4); 
    
    // Spots
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-w/4, -h/4, 2, 2);
    ctx.fillRect(0, -h/4, 2, 2);
    ctx.fillRect(-w/3, 0, 2, 2);

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -5, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 1, -4, 2, 2);
};

export const drawBoxfish = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Box shape - Bright Yellow with spots
    ctx.fillStyle = '#fdd835';
    // It's a boxfish, so... a box. slightly rounded.
    ctx.beginPath();
    // Using roundRect if available, otherwise rect
    if (ctx.roundRect) {
        ctx.roundRect(-w/2, -h/2, w, h, 4);
    } else {
        ctx.fillRect(-w/2, -h/2, w, h);
    }
    ctx.fill();

    // Honeycomb/Spot pattern (Black)
    ctx.fillStyle = 'black';
    // Draw 5 spots like a dice number 5
    const spotSize = 3;
    ctx.fillRect(-w/4, -h/4, spotSize, spotSize);
    ctx.fillRect(w/4, -h/4, spotSize, spotSize);
    ctx.fillRect(0, 0, spotSize, spotSize);
    ctx.fillRect(-w/4, h/4, spotSize, spotSize);
    ctx.fillRect(w/4, h/4, spotSize, spotSize);

    // Lips (Puckered)
    ctx.fillStyle = '#f9a825';
    ctx.fillRect(w/2, -2, 3, 4);

    // Tiny fins
    ctx.fillStyle = '#f9a825';
    // Removed top and bottom spines/fins as requested
    ctx.fillRect(-w/2 - 3, -3, 3, 6); // Tail (Tiny)

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -6, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 2, -5, 2, 2);
};

export const drawPomfret = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Silver body, diamond shape
    ctx.fillStyle = '#b0bec5'; 
    ctx.beginPath();
    ctx.moveTo(w/2, 0); // Nose
    ctx.lineTo(0, -h/2); // Top
    ctx.lineTo(-w/2, 0); // Tail base
    ctx.lineTo(0, h/2); // Bottom
    ctx.closePath();
    ctx.fill();

    // Tail (VERY Distinct Scissor-shape) - Smaller
    ctx.fillStyle = '#78909c'; 
    ctx.beginPath();
    // Start from tail base (left side of body)
    ctx.moveTo(-w/2, 0);
    
    // Draw top prong (Smaller)
    ctx.lineTo(-w/2 - 10, -10); 
    ctx.lineTo(-w/2 - 6, -3);   // Inner upper edge
    
    // Draw deep V notch
    ctx.lineTo(-w/2 - 2, 0);
    
    // Draw bottom prong
    ctx.lineTo(-w/2 - 6, 3);    // Inner lower edge
    ctx.lineTo(-w/2 - 10, 10); 
    
    ctx.closePath();
    ctx.fill();

    // Side Fin (Triangle) - FLIPPED HORIZONTALLY
    // Now pointing towards the tail (Left) instead of the nose (Right)
    ctx.fillStyle = '#90a4ae'; // Slightly darker grey/blue
    ctx.beginPath();
    ctx.moveTo(-8, 0); // Back point (tip pointing tail-wards)
    ctx.lineTo(4, -5); // Top front (base)
    ctx.lineTo(4, 5); // Bottom front (base)
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/4, -4, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/4 + 2, -3, 2, 2);
};

export const drawPufferfish = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Round body
    ctx.fillStyle = '#ffe0b2'; // Beige/Tan body
    ctx.beginPath();
    ctx.arc(0, 0, w/2, 0, Math.PI * 2);
    ctx.fill();

    // Belly (White)
    ctx.fillStyle = '#fff3e0';
    ctx.beginPath();
    ctx.arc(0, h/4, w/3, 0, Math.PI * 2);
    ctx.fill();

    // Spines (Triangles) - OUTSIDE
    ctx.fillStyle = '#d7ccc8'; // Darker spine color
    const numSpines = 8;
    for(let i=0; i<numSpines; i++) {
        const angle = (i / numSpines) * Math.PI * 2;
        const r = w/2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle); // Angle points outward from center
        ctx.beginPath();
        // Regular Triangle pointing OUT
        ctx.moveTo(0, -3.5); // Base Top
        ctx.lineTo(6, 0);    // Tip (pointing outward along rotated X-axis)
        ctx.lineTo(0, 3.5);  // Base Bottom
        ctx.fill();
        ctx.restore();
    }

    // Spines (Triangles) - INSIDE
    // Shifted UP a little bit
    ctx.fillStyle = '#8d6e63'; // Darker contrast
    ctx.beginPath();
    
    const shiftY = 2; // Moving body pattern up

    const drawTri = (cx: number, cy: number) => {
        // Regular triangle pointing UP
        // Height ~6, Base ~7
        ctx.moveTo(cx, cy - 4);       // Tip
        ctx.lineTo(cx - 3.5, cy + 2); // Base Left
        ctx.lineTo(cx + 3.5, cy + 2); // Base Right
    };

    // Center spine
    drawTri(0, -2 + shiftY);
    // Top spine
    drawTri(0, -14 + shiftY);
    // Bottom spine
    drawTri(0, 10 + shiftY);
    // Left spine
    drawTri(-12, -2 + shiftY);

    ctx.fill();

    // Fins (Small)
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(-w/4, 2, 6, 4);

    // Eye (Wide)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/4, -8, 5, 5);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/4 + 2, -7, 2, 2);
    
    // Mouth
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(w/2 - 2, 2, 3, 2);
};
