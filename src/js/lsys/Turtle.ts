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
        const r = this.radius;
        const r2 = r * .5;
        const l = Math.floor( (this.step - 2*r) / r2 );
        const next_pos = VEC2(
            this.pos.x + this.step * cos( this.angle ),
            this.pos.y + this.step * sin( this.angle ),
        );

        for ( let i=1; i<l-1; ++i )
        {
            const p = this.pos.lerp( next_pos, i / (l-1) );
            const v = pSys.addParticle( p, r2 );
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
