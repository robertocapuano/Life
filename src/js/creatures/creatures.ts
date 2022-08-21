import { FxConstantForce } from "../fx/FxForces";
import { ONE_SEC } from "../fx/FxParticle";
import { FxParticleSystem } from "../fx/FxParticleSystem";
import { VEC2 } from "../fx/vec2";
import { HEIGHT, WIDTH } from "../MainConstants";
import { cos, sin, TWOPI } from "../marching-square/math";

export function createSkeleton( pSys: FxParticleSystem)
{
    const R = 10;
    
    {
        const N = 10;
        const D = 2 * R;

        const PX = WIDTH * .5;
        const PY = HEIGHT - R;

        for ( let i=0; i<N; ++i )
        {
            const cx = PX;
            const cy = PY - i * D;

            const u = pSys.addParticle( VEC2( cx, cy ), R );

        }
    }

    if (false)
    {
        const DR = 80;
        const M = TWOPI * (DR) / (3*R);
        const dA = TWOPI/M;

        const PX = WIDTH * .5;
        const PY = HEIGHT * .5;

        for ( let i=0; i<M; ++i )
        {
            const cx = PX + DR * cos( dA * i );
            const cy = PY + DR * sin( dA * i );
            
            const u = pSys.addParticle( VEC2( cx, cy ), R );
        }
    }


}

