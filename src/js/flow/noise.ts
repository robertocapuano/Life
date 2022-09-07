import SimplexNoise from 'simplex-noise';
import { VEC2, vec2 } from '../fx/vec2';

export class Noise
{
    private simplex = new SimplexNoise();

    // public computeSimplex( uv: vec2 ): vec2
    // {
    //     const u1 = this.simplex.noise2D(uv.x, uv.y ) * .5 + .5;
    //     return u1;
    // }

    public computeCurl2( uv0: vec2 ): vec2
    {
        const eps = 1e-4;

        const uv = uv0.scale(1e-2);
        const u1 = this.simplex.noise2D(uv.x - eps, uv.y ) * .5 + .5;
        const u2 = this.simplex.noise2D(uv.x + eps, uv.y ) * .5 + .5;
        const du = (u2 - u1) / (2 *eps);

        const v1 = this.simplex.noise2D(uv.x, uv.y - eps ) * .5 + .5;
        const v2 = this.simplex.noise2D(uv.x, uv.y + eps) * .5 + .5;
        const dv = (v2 - v1) / (2 *eps);
        
        //Curl
        return VEC2(dv, -du);
    }

    // public computeCurl3( p0: vec3, ): vec3
    // {
    //     const eps = 1e-4; 
    //     let n1=0;
    //     let n2=0;
    //     const curl = VEC3_ZERO();

    //     const p = VEC3( p0.x , p0.y , p0.z  );

    //     {
    //         n1 = this.simplex.noise3D(p.x, p.y + eps, p.z);
    //         n2 = this.simplex.noise3D(p.x, p.y - eps, p.z); 
    //         const a = (n1 - n2)/(2 * eps);
            
    //         n1 = this.simplex.noise3D(p.x, p.y, p.z + eps); 
    //         n2 = this.simplex.noise3D(p.x, p.y, p.z - eps);
    //         const b = (n1 - n2)/(2 * eps);
    //         curl.x = a - b;
    //     }

    //     {
    //         n1 = this.simplex.noise3D(p.x, p.y, p.z + eps); 
    //         n2 = this.simplex.noise3D(p.x, p.y, p.z - eps); 
    //         const a = (n1 - n2)/(2 * eps);

    //         n1 = this.simplex.noise3D(p.x + eps, p.y, p.z); 
    //         n2 = this.simplex.noise3D(p.x + eps, p.y, p.z); 
    //         const b = (n1 - n2)/(2 * eps);
            
    //         curl.y = a - b;
    //     }

    //     {
    //         n1 = this.simplex.noise3D(p.x + eps, p.y, p.z); 
    //         n2 = this.simplex.noise3D(p.x - eps, p.y, p.z); 
    //         const a = (n1 - n2)/(2 * eps);

    //         n1 = this.simplex.noise3D(p.x, p.y + eps, p.z); 
    //         n2 = this.simplex.noise3D(p.x, p.y - eps, p.z); 
    //         const b = (n1 - n2)/(2 * eps);

    //         curl.z = a-b;
    //     }

    //     return curl;
    // }

    // public computeCurl4( p0: vec3, time: number ): vec3
    // {
    //     return this.computeCurl3( p0.add( VEC3(0,0,time) ) );
    // }
}
