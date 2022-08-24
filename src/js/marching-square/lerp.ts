/**
 * Linear interpolation function
 */
export function lerp5(x0: number, x1: number, y0: number, y1: number, x: number): number 
{
    if (x0 === x1)
        return x0;

    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}

export function lerp3(a: number, b: number,  x: number): number 
{
    return a + (b-a) * x;
}
