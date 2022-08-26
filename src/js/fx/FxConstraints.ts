import { clamp, cos, sin } from "../math";
import { FxParticle, FxPos } from "./FxParticle";
import { mag, sub, VEC2, vec2 } from "./vec2";

export type FxConstraint = { 
    apply: ( p1: FxPos[] ) => void, 
    has: ( p: FxParticle ) => boolean,
}
export type FxConstraints = Array<FxConstraint>;

export function FxLinkConstraint( 
    u: FxParticle, 
    v: FxParticle, 
    min_length: number, 
    max_length: number = min_length,
): FxConstraint
{
    return {
        apply: ( p: Array<vec2> ) => {

            const p_u = p[u];
            const p_v = p[v];

            const delta = sub( p_u, p_v );
            const delta_length = mag(delta);
            const rest_length = clamp( delta_length, min_length, max_length );
            const diff = (delta_length - rest_length) / rest_length;

            delta.scaleInPlace( .5 * diff );

            p_u.subInPlace( delta );
            p_v.addInPlace( delta );
        },
        has: ( p: FxParticle ) => ( p === u || p === v ),
    };
}

export function FxDistanceConstraint( 
    u: number, 
    pivot_pos: vec2, 
    min_dist: number, 
    max_dist: number = min_dist,
): FxConstraint {
    return {
            apply: ( p: Array<vec2> ) => {

            const p_u = p[u];
            const diff = sub( p_u, pivot_pos );
            const dist = diff.mag();
            if (dist<Number.EPSILON)
                return;

            const dire = diff.normalize();
            const new_dist = clamp( dist, min_dist, max_dist );

            const u_pos =pivot_pos.add( dire.scaleInPlace( new_dist ) );
            p[u] = u_pos;

        },
        has: ( p: FxParticle ) => ( p === u ),
    };
}

export function FxAngle1PConstraint( 
    u: FxParticle, 
    pivot: vec2, 
    axis_ref: vec2, 
    angle: number,
): FxConstraint
{
    return {
        apply: ( p: Array<vec2> ) => {

            const up_diff = p[u].sub( pivot);
            const up_dist = up_diff.mag();
            const up_dir = up_diff.normalize();
            
            const rot_angle = up_dir.angle( axis_ref );

            const new_angle = clamp( rot_angle, -angle, +angle );
            const new_dir = VEC2(
                axis_ref.x * cos( new_angle) - axis_ref.y * sin(new_angle),
                axis_ref.x * sin( new_angle) + axis_ref.y * cos(new_angle),
            );

            const u_pos = pivot.add( new_dir.scale( up_dist ) );
            p[u] = u_pos;
        },
        has: ( p: FxParticle ) => ( p === u ),
    };
}

export function FxAngle2PConstraint( 
    u: FxParticle, 
    v: FxParticle, 
    axis_ref: vec2, 
    angle: number,
): FxConstraint
{
    return {
        apply: ( p: Array<vec2> ) => {

            const uv_diff = p[u].sub( p[v] );
            const uv_dist = uv_diff.mag();
            const uv_dir = uv_diff.normalize();
            
            const rot_angle = uv_dir.angle( axis_ref );

            const new_angle = clamp( rot_angle, -angle, +angle );
            const new_dir = VEC2(
                axis_ref.x * cos(new_angle) - axis_ref.y * sin(new_angle),
                axis_ref.x * sin(new_angle) + axis_ref.y * cos(new_angle),
            );

            const u_pos = p[v].add( new_dir.scale( uv_dist ) );
            p[u] = u_pos;
        },
        has: ( p: FxParticle ) => ( p === u ),
    };
}
