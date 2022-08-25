import { FxParticleSystem } from "../fx/FxParticleSystem";
import { VEC2, vec2, VEC2_ZERO } from "../fx/vec2";
import { LOGI } from "../logs";
import { cos, sin } from "../math";

export class Turtle
{
    constructor(
        public radius: number,
        public pos: vec2,
        public angle: number,
        public step: number,
        public alpha: number,
        public last_part: number = -1,
    ) {}

    forward( pSys: FxParticleSystem )
    {
        const dire = VEC2( 
            cos( this.angle ),
            sin( this.angle ),
        );

        const next_pos = this.pos.add( dire.scale( this.step ) );

        {
            const r = this.radius;
            const r2 = r * .5;
            const inner_dist = this.step - 2 * r - 2 *r2;
            
            const start_pos = this.pos.add( dire.scale( r + r2 ) );
            const end_pos = start_pos.add( dire.scale( inner_dist )) ;
            
            const l = Math.floor( inner_dist / (2*r2) );

            for ( let i=0; i<l; ++i )
            {
                const p = start_pos.lerp( end_pos, i / (l-1) );
                const v = pSys.addParticle( p, r2 );
            }
        }

        this.pos = next_pos;
        const u = pSys.addParticle( this.pos, this.radius );
        this.last_part = u;
        LOGI(`add particle at ${this.pos.toString() }`);
    }

    right()
    {
        this.angle += this.alpha;
    }

    left()
    {
        this.angle -= this.alpha;
    }

    fork(): Turtle
    {
        return new Turtle( 
            this.radius,
            this.pos.clone(), 
            this.angle, 
            this.step, 
            this.alpha, 
            this.last_part 
        );
    }
    
}
