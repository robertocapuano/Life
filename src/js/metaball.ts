import { Circle } from "./circle";

export function metaball( x: number, y: number, circles: Array<Circle> )
{
    let sum = 0;
    for (let i = 0; i < circles.length; i++)
    {
        const c = circles[i];
        const dx = x - c.x;
        const dy = y - c.y;

        const d2 = dx * dx + dy * dy;
        sum += c.r2 / d2;
    }

    return sum;
}
