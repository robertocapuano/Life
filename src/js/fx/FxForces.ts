import { FxParticle, FxParticleCheck, FxPos } from "./FxParticle";
import { vec2 } from "./vec2";

export type FxForce = [ ( p1: FxPos[], p0: FxPos[], a: Array<vec2> ) => void, ( p: FxParticle ) => boolean ]; 
export type FxForces = Array<FxForce>;

export function FxConstantForce( u: FxParticle, f: vec2 ): FxForce
{
    return [
        ( q1: FxPos[], q0: FxPos[], a: Array<vec2> ) => {
            a[u].addInPlace( f );
        },
        ( p: FxParticle ) => (p === u),
    ];
}
