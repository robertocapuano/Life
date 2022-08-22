import { FxLinkConstraint } from "../fx/FxConstraints";
import { FxConstantForce } from "../fx/FxForces";
import { ONE_SEC } from "../fx/FxParticle";
import { FxParticleSystem } from "../fx/FxParticleSystem";
import { VEC2 } from "../fx/vec2";
import { LOGI } from "../logs";
import { HEIGHT, WIDTH } from "../MainConstants";
import { cos, sin, TWOPI } from "../marching-square/math";
import { Modulo } from "../math";

export function createSkeleton( pSys: FxParticleSystem)
{
    const R = 10;

    {
        const N = 5;
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

   
    {
        const DR = 80;
        const M = TWOPI * (DR) / (2*R);
        const dA = TWOPI/M;

        const PX = WIDTH * .5;
        const PY = HEIGHT * .5;

        const ps = [];

        const _M = Math.trunc( M );
        for ( let i=0; i<_M; ++i )
        {
            const cx = PX + DR * cos( dA * i );
            const cy = PY + DR * sin( dA * i );
            
            const u = pSys.addParticle( VEC2( cx, cy ), R );
            ps.push( u );
        }

        for ( let i=0; i<_M; ++i )
        {
            const u = ps[i];
            const v = ps[Modulo( i-1, _M )];
            // const k = Modulo( i+1, _M );

            // LOGI( `${j}-${i} `);
            pSys.addConstraint( FxLinkConstraint( u, v, 2*R, 2.5*R ));

        }



    }


}

