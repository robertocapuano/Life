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

// export function JointDotConstraint( 
//     u: FxParticle, 
//     s: FxParticle,
//     v: FxParticle, 
//     min_angle: number,
//     max_angle: number,
// ): FxConstraint
// {
//     return {
//         apply: ( p: Array<vec2> ) => {


//             const p_s = p[s];
//             const p_u = p[u];
//             const p_v = p[v];
            
//             const us_diff = p_u.sub( p_s);
//             const us_dist = us_diff.mag();
//             const us_dir = us_diff.normalize();
            
//             const vs_diff = p_v.sub( p_s );
//             const vs_dist = vs_diff.mag();
//             const vs_dir = vs_diff.normalize();
            
//             const dot = us_dir.dot( vs_dir);
//             const _dot = clamp( dot, -1., +1.);
//             const alpha = acos(_dot);
//             const ref_axis = us_dir.cross( vs_dir );
//             float angle = alpha;
            
//             if (TT_INFO && isnan(angle))
//                 LOGI("(isnan(angle))");
            
//             float _angle = angle;// alpha >= .0f ? angle : (TWOPI + angle);
//             float c_angle = glm::clamp( _angle, min_angle, max_angle );
//             float diff_angle = MathUtils::diffAngle( c_angle, _angle );
//             float delta_angle = .5f * diff_angle;
            
//             if (delta_angle == .0f)
//                 return;
            
//             vec3 us_dir_new = glm::rotate( us_dir, -delta_angle, ref_axis );
//             vec3 vs_dir_new = glm::rotate( vs_dir, delta_angle, ref_axis );
            
//             vec3 u_pos = p[s] + us_dist * us_dir_new;
//             vec3 v_pos = p[s] + vs_dist * vs_dir_new;
            
//             if ( TT_INFO && (MathUtils::VecIsNaN(u_pos) || MathUtils::VecIsNaN(v_pos) ))
//                 LOGI("( MathUtils::VecIsNaN(u_pos) || MathUtils::VecIsNaN(v_pos) )");
            
//             LOGD("angle: %f, c_angle: %f, diff_angle: %f", DEG(angle), DEG(c_angle), DEG(diff_angle));
            
//             p[u] = u_pos;
//             p[v] = v_pos;


//             const uv_diff = p[u].sub( p[v] );
//             const uv_dist = uv_diff.mag();
//             const uv_dir = uv_diff.normalize();
            
//             const rot_angle = axis_ref .angle( uv_dir );

//             const new_angle = clamp( rot_angle, -angle, +angle );
//             const new_dir = VEC2(
//                 axis_ref.x * cos(new_angle) - axis_ref.y * sin(new_angle),
//                 axis_ref.x * sin(new_angle) + axis_ref.y * cos(new_angle),
//             );

//             const u_pos = p[v].add( new_dir.scale( uv_dist ) );
//             p[u] = u_pos;
//         },
//         has: ( p: FxParticle ) => ( p === u ),
//     };
// }

