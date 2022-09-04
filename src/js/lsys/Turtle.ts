import { FxAngle1PConstraint, FxAngle2PConstraint, FxBoxConstraint, FxDistancePointConstraint, FxLinkConstraint } from "../fx/FxConstraints";
import { FxConstantForce } from "../fx/FxForces";
import { FxParticle } from "../fx/FxParticle";
import { FxParticleSystem } from "../fx/FxParticleSystem";
import { VEC2, vec2 } from "../fx/vec2";
import { LOGI } from "../logs";
import { AXIS_ANGLE, HEIGHT, WIDTH } from "../MainConstants";
import { cos, RAD, sin } from "../math";
import { RND01 } from "../random";

export class Turtle
{
    constructor(
        public main_radius: number,
        public secondary_radius: number,
        public pos: vec2,
        public angle: number,
        public step: number,
        public alpha: number,
        public last_part: number = -1,
    ) {}

    // root( pSys: FxParticleSystem ): FxParticle
    // {
    //     const r = this.main_radius;
    //     const v = pSys.addParticle( this.pos, r );
    //     const dire = VEC2( 
    //         cos( this.angle ),
    //         sin( this.angle ),
    //         );
            
    //     const next_pos = this.pos.add( dire.scale( r ) );
        
    //     this.pos = next_pos ;
    //     this.last_part = v;
    //     return v;
    // }

    forward( pSys: FxParticleSystem ): Array<FxParticle>
    {
        const particles = new Array<FxParticle>();
        const prev_pos = this.pos.clone();

        const dire = VEC2( 
            cos( this.angle ),
            sin( this.angle ),
        );

        const next_pos = this.pos.add( dire.scale( this.step ) );

        // let prev_chain = this.last_part;

        {
            const r = this.main_radius;
            const r2 = this.secondary_radius;
            const inner_dist = this.step - 2 * r - 2 *r2;
            
            const start_pos = this.pos.add( dire.scale( r + r2 ) );
            const end_pos = start_pos.add( dire.scale( inner_dist )) ;
            
            const l = Math.floor( inner_dist / (2*r2) );

            for ( let i=0; i<l; ++i )
            {
                const m = (l===1) ? .5 :  i / (l-1);
                const pos = start_pos.lerp( end_pos, m );
                const v = pSys.addParticle( pos, r2 );
                particles.push(v);
            }
        }

        this.pos = next_pos;
        const u = pSys.addParticle( this.pos, this.main_radius );
        particles.push(u);

        if ( this.last_part>=0)
        {
            const L = pSys.getPos( this.last_part ).sub( pSys.getPos( particles[0] )).mag();
            pSys.addConstraint( FxLinkConstraint( this.last_part, particles[0], L, 1.1 * L ));
        }
        else
        {
            pSys.addConstraint( FxDistancePointConstraint( particles[0], pSys.getPos( particles[0]).clone(), 0, 10 ) );
        }

        for ( let i=1; i<particles.length; ++i ) {
            const L = pSys.getPos( particles[i] ).sub( pSys.getPos(particles[i-1])).mag();
            pSys.addConstraint( FxLinkConstraint( particles[i], particles[i-1], L, 1.1 * L ));
        }
      
        {
            const axis_constraint = (this.last_part<0)
                    ? FxAngle1PConstraint( particles[0], prev_pos, dire, AXIS_ANGLE )
                    : FxAngle2PConstraint( particles[0], this.last_part, dire, AXIS_ANGLE );

            pSys.addConstraint( axis_constraint );
        }

        for ( let i=1; i<particles.length; ++i )
        {
            const axis_constraint = FxAngle2PConstraint( particles[i], particles[i-1], dire, AXIS_ANGLE );

            pSys.addConstraint( axis_constraint );
        }

       // pSys.addForce( FxConstantForce( u, VEC2(0,1 * RND01() ) ) );

       {
           for ( let p of particles )
           {
                const rp = pSys.getRadius( p );
                const SW = VEC2(WIDTH-rp, HEIGHT-rp);
                const ZERO = VEC2( rp, rp);
                pSys.addConstraint( FxBoxConstraint(p, ZERO, SW ) );
            }
       }

        this.last_part = u;
        LOGI(`add particle at ${this.pos.toString() }`);

        return particles;
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
            this.main_radius,
            this.secondary_radius,
            this.pos.clone(), 
            this.angle, 
            this.step, 
            this.alpha, 
            this.last_part 
        );
    }
    
}
