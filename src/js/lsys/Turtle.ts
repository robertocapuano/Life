import { FxParticleSystem } from "../fx/FxParticleSystem";
import { vec2 } from "../fx/vec2";
import { cos, sin } from "../math";

export class Turtle
{
    constructor(
        public pos: vec2,
        public angle: number,
        public step: number,
        public alpha: number,
        public last_part: number = -1,
    ) {}

    forward( pSys: FxParticleSystem )
    {
        const u = pSys.addParticle( this.pos );

        this.pos.x += this.step * cos( this.angle );
        this.pos.y += this.step * sin( this.angle );

        this.last_part = u;
    }

    right()
    {
        this.angle += this.alpha;
    }

    left()
    {
        this.angle += this.alpha;
    }

    fork(): Turtle
    {
        return new Turtle( 
            this.pos, 
            this.angle, 
            this.alpha, 
            this.step, 
            this.last_part 
        );
    }
    
}
