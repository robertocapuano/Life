import { FxParticle, FxParticleCheck, FxPos, INV_FRAMETIME_SQR } from "./FxParticle";
import { vec2 } from "./vec2";

export type FxForce = [ ( p1: FxPos[], p0: FxPos[], a: Array<vec2> ) => void, ( p: FxParticle ) => boolean ]; 
export type FxForces = Array<FxForce>;

export function FxConstantForce( 
    u: FxParticle, 
    f: vec2 
): FxForce {
    return [
        ( p1: FxPos[], p0: FxPos[], a: Array<vec2> ) => {
            a[u].addInPlace( f );
        },
        ( p: FxParticle ) => (p === u),
    ];
}

export function FxCollisionForce( 
    u: FxParticle, 
    v: FxParticle, 
    link_length: number 
): FxForce {
    return [
        ( p1: FxPos[], p0: FxPos[], a: Array<vec2> ) => {
            const p_u = p1[u];
            const p_v = p1[v];
            
            const delta = p_u.sub( p_v );
            
            const delta_lenght = delta.mag();
            
            const diff = (delta_lenght-link_length)/delta_lenght;
            
            const p_u1 = p_u.sub( delta.scale( .5 * diff ) );
            const p_v1 = p_v.add( delta.scale( .5 * diff ) );
            
            const fu = (p_u1.sub( p_u ) ).scale(  INV_FRAMETIME_SQR );
            const fv = (p_v1.sub( p_v ) ).scale(  INV_FRAMETIME_SQR );
            
            const a_u = a[u];
            const a_v = a[v];
            
            a_u.addInPlace(fu);
            a_v.addInPlace(fv);
        },
        ( p: FxParticle ) => (p === u || p === v),
    ];
}
