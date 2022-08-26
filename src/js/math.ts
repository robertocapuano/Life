export const { cos, sin, abs, sqrt, acos } = Math;

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
