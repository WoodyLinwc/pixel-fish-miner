
// Helper: Convert hex to rgb object
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Helper: Linear interpolate two numbers
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Helper: Linear interpolate two colors
export const lerpColor = (c1: string, c2: string, t: number) => {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  const r = Math.round(lerp(rgb1.r, rgb2.r, t));
  const g = Math.round(lerp(rgb1.g, rgb2.g, t));
  const b = Math.round(lerp(rgb1.b, rgb2.b, t));
  return `rgb(${r},${g},${b})`;
};
