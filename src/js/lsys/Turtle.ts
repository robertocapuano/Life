import { vec2 } from "../fx/vec2";
import { cos, sin } from "../marching-square/math";

export class Turtle
{
    constructor(
        public pos: vec2,
        public alpha: number,
    ) {}

    forward( d: number )
    {
        this.pos.x += d * cos( this.alpha );
        this.pos.y += d * sin( this.alpha );
    }

    right( theta: number )
    {
        this.alpha += theta;
    }

    left( theta: number )
    {
        this.alpha += theta;
    }
    
}
