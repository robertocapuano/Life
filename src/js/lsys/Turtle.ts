import { FxParticleSystem } from "../fx/FxParticleSystem";
import { vec2 } from "../fx/vec2";
import { cos, sin } from "../marching-square/math";

export class Turtle
{
    constructor(
        public pos: vec2,
        public alpha: number,
        public step: number,
        public last_part: number = -1,
    ) {}

    forward( pSys: FxParticleSystem )
    {
        const u = pSys.addParticle( this.pos );

        this.pos.x += this.step * cos( this.alpha );
        this.pos.y += this.step * sin( this.alpha );

        this.last_part = u;
    }

    right()
    {
        this.alpha += this.alpha;
    }

    left()
    {
        this.alpha += this.alpha;
    }

    fork(): Turtle
    {
        return new Turtle( this.pos, this.alpha, this.step, this.last_part );
    }
    
}
