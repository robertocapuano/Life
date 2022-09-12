import { lerp3 } from "../marching-square/lerp";
import { acos } from "../math";
import { vec2 } from "./vec2";

export class vec3
{
    static VEC3( x: number, y: number, z: number ) {
        return new vec3( x, y, z );
    }

    static fromVec2( v2: vec2 )
    {
        return new vec3( v2.x, v2.y, 0 );
    }

    constructor( 
        public x: number, 
        public y: number,
        public z: number,
    ) {}

    add( b: vec3 ): vec3
    {
        const a = this;

        return new vec3( a.x + b.x, a.y + b.y, a.z + b.z );
    }

    addInPlace( b: vec3 ): void
    {
        this.x += b.x;
        this.y += b.y;
        this.z += b.z;
    }

    subInPlace( b: vec3 ): void
    {
        this.x -= b.x;
        this.y -= b.y;
        this.z -= b.z;
    }

    negate(): vec3
    {
        const a = this;

        return new vec3( -a.x, -a.y, -a.z );
    }

    sub( b: vec3 ): vec3
    {
        const a = this;

        return new vec3( a.x - b.x, a.y - b.y, a.z - b.z );
    }

    scale( c: number ): vec3
    {
        const a = this;

        return new vec3( a.x * c, a.y * c, a.z * c );
    }

    scaleInPlace( c: number ): vec3
    {
        const a = this;

        a.x *= c;
        a.y *= c;
        a.z *= c;

        return this;
    }

    dot( b: vec3 ): number
    {
        const a = this;

        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    cross( right: vec3 ): vec3
    {
        const left = this;

        const x = left.y * right.z - left.z * right.y;
        const y = left.z * right.x - left.x * right.z;
        const z = left.x * right.y - left.y * right.x;

        return new vec3( x, y , z );
    }

    mag(): number
    {
        const a = this;

        return Math.sqrt( a.x * a.x + a.y * a.y + a.z * a.z );
    }

    assign( x: number, y: number, z: number )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    zero(): vec3
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        return this;
    }

    copyFrom( b: vec3 ): vec3
    {
        this.x = b.x;
        this.y = b.y;
        this.z = b.z;

        return this;
    }

    lerp( b: vec3, t: number ): vec3
    {
        const a = this;
        return new vec3( lerp3( a.x, b.x, t), lerp3( a.y, b.y, t), lerp3( a.z, b.z, t) );
    }

    normalize(): vec3 
    {
        return this.scale( 1 / this.mag() );
    }

    angle( b: vec3 ): number
    {
        const a = this;

        return acos( a.dot( b ) / ( a.mag() * b.mag() ) );
    }

    clone(): vec3
    {
        return new vec3( this.x, this.y, this.z );
    }

    toVec2(): vec2
    {
        return new vec2( this.x, this.y );
    }

    toString(): string
    {
        return `[${this.x},${this.y},${this.z}]`;
    }

    isNaN(): boolean
    {
        return isNaN(this.x) || isNaN(this.y) || isNaN(this.z);
    }

    isInfinity(): boolean
    {
        return !isFinite(this.x) || !isFinite(this.y) || !isFinite(this.z);
    }
}




export const VEC3_ZERO = () => new vec3(0,0,0);
export const VEC3 = vec3.VEC3;
