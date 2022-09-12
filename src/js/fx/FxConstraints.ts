import { acos, clamp, cos, min, sin } from "../math";
import { FxParticle, FxPos, ONE_SEC } from "./FxParticle";
import { mag, sub, VEC2, vec2 } from "./vec2";
import { vec3 } from "./vec3";

export type FxConstraint = { 
    apply: ( p1: FxPos[] ) => void, 
    has: ( p: FxParticle ) => boolean,
}
export type FxConstraints = Array<FxConstraint>;

export function FxNoneConstraint( 
    u: FxParticle, 
): FxConstraint
{
    return {
        apply: ( p: Array<vec2> ) => {

           },
        has: ( p: FxParticle ) => ( p === u ),
    };
}


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

export function FxBoxConstraint( 
    u: FxParticle,
    minp: vec2,
    maxp: vec2,
): FxConstraint
{
    return {
        apply: ( p: Array<vec2> ) => {

            const p_u = p[u];
            p_u.x = clamp( p_u.x, minp.x, maxp.x );
            p_u.y = clamp( p_u.y, minp.y, maxp.y );

        },
        has: ( p: FxParticle ) => ( p === u  ),
    };
}

export function FxDistancePointConstraint( 
    u: number, 
    pivot_pos: vec2, 
    min_dist: number = 0, 
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
            const up_dire = up_diff.normalize();
            
            const axis_ref_v3 = vec3.fromVec2( axis_ref );
            const up_dire_v3 = vec3.fromVec2( up_dire );
            const cr = axis_ref_v3.cross( up_dire_v3 );
            const angle_sign = cr.z > 0 ? +1 : -1;

            const rot_angle =  angle_sign * axis_ref.angle( up_dire );

            const new_angle = clamp( rot_angle, -angle, +angle );
            const new_dir = VEC2(
                axis_ref.x * cos( new_angle) - axis_ref.y * sin(new_angle),
                axis_ref.x * sin( new_angle) + axis_ref.y * cos(new_angle),
            );

            const u_pos = pivot.add( new_dir.scale( up_dist ) );
            p[u] =  u_pos;//.add(p[u]).scale(1/ONE_SEC);//u_pos;
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
            
            const axis_ref_v3 = vec3.fromVec2( axis_ref );
            const uv_dir_v3 = vec3.fromVec2( uv_dir );
            const cr = axis_ref_v3.cross( uv_dir_v3 );
            const angle_sign = cr.z > 0 ? +1 : -1;

            const rot_angle = angle_sign * axis_ref .angle( uv_dir  );

            const new_angle = clamp( rot_angle, -angle, +angle );
            const new_dir = VEC2(
                axis_ref.x * cos(new_angle) - axis_ref.y * sin(new_angle),
                axis_ref.x * sin(new_angle) + axis_ref.y * cos(new_angle),
            );

            const u_pos = p[v].add( new_dir.scale( uv_dist ) );
            p[u] = u_pos;//u_pos.add(p[u]).scale(1/ONE_SEC);// scale(.5).add(p[u].scale(.5));
        },
        has: ( p: FxParticle ) => ( p === u || p === v),
    };
}


export function FxAngle3PConstraint( 
    u: FxParticle, 
    v: FxParticle,
    s: FxParticle,
    angle: number,
): FxConstraint
{
    return {
        apply: ( p: Array<vec2> ) => {
            
            const axis_ref = p[v].sub(p[s]).normalize();
            
            const uv_diff = p[u].sub( p[v] );
            const uv_dist = uv_diff.mag();
            const uv_dir = uv_diff.normalize();

            const axis_ref_v3 = vec3.fromVec2( axis_ref );
            const uv_dir_v3 = vec3.fromVec2( uv_dir );
            const cr = axis_ref_v3.cross( uv_dir_v3 );
            const angle_sign = cr.z > 0 ? +1 : -1;

            const rot_angle = angle_sign * axis_ref .angle( uv_dir  );

            const new_angle = clamp( rot_angle, -angle, +angle );
            const new_dir = VEC2(
                axis_ref.x * cos(new_angle) - axis_ref.y * sin(new_angle),
                axis_ref.x * sin(new_angle) + axis_ref.y * cos(new_angle),
            );

            const u_pos = p[v].add( new_dir.scale( uv_dist ) );
            p[u] = u_pos;//u_pos.add(p[u]).scale(1/ONE_SEC);// scale(.5).add(p[u].scale(.5));
        },
        has: ( p: FxParticle ) => ( p === u || p ===v || p=== s),
    };
}
