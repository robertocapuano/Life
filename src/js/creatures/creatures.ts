import { FxConstantForce } from "../fx/FxForces";
import { ONE_SEC } from "../fx/FxParticle";
import { FxParticleSystem } from "../fx/FxParticleSystem";
import { VEC2 } from "../fx/vec2";

export function createSkeleton( pSys: FxParticleSystem)
{
    const i = pSys.addParticle( VEC2( 40, 40 ), 14 );
    pSys.addParticle( VEC2( 60, 60 ) );
    pSys.addTmpForce( FxConstantForce( i, VEC2( 1, 2 ).scale( ONE_SEC ) ));

    // for 

}

