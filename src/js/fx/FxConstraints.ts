import { clamp } from "../math";
import { FxParticle, FxPos } from "./FxParticle";
import { mag, sub, vec2 } from "./vec2";

export type FxConstraint = { 
    actuator: ( p1: FxPos[] ) => void, 
    checker: ( p: FxParticle ) => boolean,
}
export type FxConstraints = Array<FxConstraint>;

export function LinkConstraint( 
    u: FxParticle, 
    v: FxParticle, 
    min_length: number, 
    max_length: number=min_length,
): FxConstraint
 {
    return {
        actuator: ( p: Array<vec2> ) => {

            const p_u = p[u];
            const p_v = p[v];

            const delta = sub( p_u, p_v );
            const delta_length = mag(delta);
            const rest_length = clamp( delta_length, min_length, max_length );
            const diff = (delta_length- rest_length)/rest_length;

            delta.scaleInPlace( .5 * diff );

            p_u.addInPlace( delta );
            p_v.addInPlace( delta );
        },
        checker: ( p: FxParticle ) => ( p === u || p === v ),
    ];
}

// export function DistanceConstraint( u: number, pivot_pos: vec3, min_dist: number, max_dist: number=min_dist ): FxConstraint
// {
//     return ( p: Array<vec3> ) => {

//         const p_u = p[u];
//         const diff = sub( p_u, pivot_pos );
//         const dire = norm( diff );
//         const dist = mag( diff );
//         const new_dist = clamp( dist, min_dist, max_dist );
        
//         p_u.copyFrom( add( pivot_pos, dire.scaleInPlace( new_dist ) ) );
//     };
// }
