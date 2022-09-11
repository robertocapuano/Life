export const { cos, sin, abs, sqrt, acos, min, max, trunc } = Math;

export const { PI } = Math;
export const TWOPI = 2 * PI;
export const PI_2 = .5 * PI;

export function clamp( x: number, min: number, max: number )
{
    return Math.min( Math.max( x, min), max );
}

export function RAD(x: number) { return x * (Math.PI / 180.0); }
export function DEG(x: number) { return x * (180.0 / Math.PI); }

export function Modulo(a: number, base: number) {
    return ((a % base) + base) % base;
}

export function POW2( x: number ) { return x * x; }
export function POW3( x: number ) { return x * x * x; }

export function easeOutCubic(x: number): number {
    return 1 - POW3(1 - x );
}

export function easeOutQuad(x: number): number {
    return 1 - POW2(1 - x);
}

