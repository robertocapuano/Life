import SimplexNoise from 'simplex-noise';
import { VEC2, vec2 } from '../fx/vec2';

export class Noise
{
    private simplex = new SimplexNoise();


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

}
