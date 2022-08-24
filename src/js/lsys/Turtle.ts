import { FxParticleSystem } from "../fx/FxParticleSystem";
import { vec2 } from "../fx/vec2";
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
        this.pos.x += this.step * cos( this.angle );
        this.pos.y += this.step * sin( this.angle );

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
