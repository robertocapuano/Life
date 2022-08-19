/**
 * Linear interpolation function
 */
export function lerp(x0: number, x1: number, y0: number, y1: number, x: number): number 
{
    if (x0 === x1)
        return x0;

    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}
