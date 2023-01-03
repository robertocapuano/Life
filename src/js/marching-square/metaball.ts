import { TTWORLD } from "../WorldRefs";

export function metaball( x: number, y: number )
{
    const { pSys } = TTWORLD;

    let sum = 0;

    const count = pSys.count();

    for (let i = 0; i < count; i++)
    {
        const pos = pSys.getPos(i);
        if (!pos)
            continue;

        const r = pSys.getRadius( i );
        const r2 = r * r;
        const dx = x - pos.x;
        const dy = y - pos.y;

        const d2 = dx * dx + dy * dy;
        sum += r2 / d2;
    }

    return sum;
}
