
export const drawClownfish = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Pixel Clown: Rectangular Body with Vertical Stripes
    ctx.fillStyle = '#ff6d00'; // Orange
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Tail
    ctx.fillRect(-w/2 - 6, -6, 6, 12);

    // Stripes (White blocks) using relative sizing
    const stripeW = w * 0.15;
    ctx.fillStyle = 'white';
    // Middle stripe
    ctx.fillRect(-stripeW/2, -h/2, stripeW, h);
    // Head stripe
    ctx.fillRect(w/3, -h/2, stripeW * 0.8, h);
    // Tail stripe
    ctx.fillRect(-w/2 + 2, -h/2, stripeW * 0.8, h);
    
    // Eye (White Sclera)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -4, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 1, -3, 2, 2);
};

export const drawSquid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Squid: Pointy head (mantle) on Right, tentacles on Left
    const bodyColor = '#e57373'; // Pinkish Red
    
    // Head/Mantle Tip (Triangle)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(0, -h/3);
    ctx.lineTo(0, h/3);
    ctx.fill();

    // Mantle Body (Rect)
    ctx.fillRect(-w/3, -h/3, w/3, h*0.66);

    // Tentacles
    ctx.fillStyle = '#ffcdd2'; // Lighter pink
    const tLen = w/2;
    ctx.fillRect(-w/3 - tLen, -h/4, tLen, 3);
    ctx.fillRect(-w/3 - tLen, -2, tLen, 3);
    ctx.fillRect(-w/3 - tLen, h/4 - 3, tLen, 3);

    // Eyes (Adjusted to be near the base of tentacles)
    // Positioned at the left edge of the main body (-w/3)
    ctx.fillStyle = 'white';
    ctx.fillRect(-w/4, -6, 5, 5); // Behind (top)
    ctx.fillRect(-w/4, 2, 5, 5); // Front (bottom)

    ctx.fillStyle = 'black';
    ctx.fillRect(-w/4 + 1, -5, 2, 2);
    ctx.fillRect(-w/4 + 1, 3, 2, 2);
};

export const drawSeaBass = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Sea Bass: Greenish, robust
    const bodyColor = '#9ccc65'; // Light Green
    const darkColor = '#689f38'; // Dark Green
    
    // Body (Rounded Rect approximation)
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Top Fin (Spiky)
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.moveTo(-w/4, -h/2);
    ctx.lineTo(0, -h/2 - 6);
    ctx.lineTo(w/4, -h/2);
    ctx.fill();

    // Tail
    ctx.fillStyle = darkColor;
    ctx.fillRect(-w/2 - 8, -6, 8, 12);

    // Horizontal faint stripes (UPDATED)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for(let i=1; i<4; i++) {
            // Spacing vertically
            ctx.fillRect(-w/2 + 5, -h/2 + i * (h/4), w - 10, 2);
    }

    // Lateral Line
    ctx.fillStyle = darkColor;
    ctx.fillRect(-w/2 + 5, 0, w - 10, 2);

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -5, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 2, -4, 2, 2);
};

export const drawRedSnapper = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Pinkish red
    ctx.fillStyle = '#ef5350';
    // Body
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Spiky dorsal fin
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.moveTo(-10, -h/2);
    ctx.lineTo(0, -h/2 - 8);
    ctx.lineTo(10, -h/2);
    ctx.fill();
    
    // Tail
    ctx.fillStyle = '#c62828';
    ctx.fillRect(-w/2 - 6, -8, 6, 16);
    
    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/4, -6, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/4 + 1, -5, 2, 2);
};

export const drawSalmon = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // King Salmon: Pink/Orange body, Dark head
    const bodyColor = '#ff8a65'; // Deep Orange/Pink
    const headColor = '#607d8b'; // Blue Grey
    const finColor = '#37474f';

    // Body
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-w/2, -h/2, w * 0.7, h); // Rear 70% is pink

    // Head (Front 30%)
    ctx.fillStyle = headColor;
    ctx.fillRect(w * 0.2, -h/2, w * 0.3, h);

    // Tail
    ctx.fillStyle = finColor;
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 8, -8);
    ctx.lineTo(-w/2 - 8, 8);
    ctx.fill();

    // Specks on back
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-w/4, -h/2 + 2, 2, 2);
    ctx.fillRect(-w/3, -h/2 + 4, 2, 2);
    ctx.fillRect(0, -h/2 + 3, 2, 2);
    // Additional specks
    ctx.fillRect(-w/5, -h/2 + 6, 2, 2); 
    ctx.fillRect(w/5, -h/2 + 2, 2, 2);
    ctx.fillRect(-w/2 + 6, -h/2 + 3, 2, 2);
    ctx.fillRect(w/10, -h/2 + 5, 2, 2);

    // Lateral Line
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-w/2, 0, w * 0.7, 1);

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -4, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 2, -3, 2, 2);
};

export const drawTuna = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Blocky Tuna: Split colors horizontal
    // Top half
    ctx.fillStyle = '#1565c0'; // Dark Blue
    ctx.fillRect(-w/2, -h/2, w, h/2);
    
    // Bottom half
    ctx.fillStyle = '#90caf9'; // Light Blue/Grey
    ctx.fillRect(-w/2, 0, w, h/2);

    // Tail
    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(-w/2 - 10, -8, 10, 16);

    // Yellow finlets (pixels)
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(-w/4, -h/2 - 2, 4, 2);
    ctx.fillRect(0, -h/2 - 2, 4, 2);
    ctx.fillRect(-w/4, h/2, 4, 2);
    ctx.fillRect(0, h/2, 4, 2);

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -4, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3+1, -4, 2, 2);
};

export const drawNeedlefish = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Needlefish: Long thin body, long beak
    ctx.fillStyle = '#80deea'; // Cyan/Light Blue
    
    // Body (Cylinder)
    ctx.fillRect(-w/2, -h/2, w * 0.7, h);

    // Long Beak (Top and Bottom jaws)
    ctx.fillStyle = '#4dd0e1';
    ctx.fillRect(w * 0.2, -2, w * 0.3, 2); // Top jaw
    ctx.fillRect(w * 0.2, 1, w * 0.35, 2); // Bottom jaw (slightly longer)

    // Dorsal/Anal fins (Set far back)
    ctx.fillStyle = '#00bcd4';
    ctx.beginPath();
    ctx.moveTo(-w/4, -h/2);
    ctx.lineTo(-w/3, -h/2 - 6);
    ctx.lineTo(-w/2 + 5, -h/2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-w/4, h/2);
    ctx.lineTo(-w/3, h/2 + 6);
    ctx.lineTo(-w/2 + 5, h/2);
    ctx.fill();

    // Tail (Forked)
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 6, -6);
    ctx.lineTo(-w/2 - 6, 6);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w * 0.15, -4, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w * 0.15 + 1, -3, 2, 2);
};
