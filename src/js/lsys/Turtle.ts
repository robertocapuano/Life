import { FxAngle1PConstraint, FxAngle2PConstraint, FxLinkConstraint } from "../fx/FxConstraints";
import { FxParticle } from "../fx/FxParticle";
import { FxParticleSystem } from "../fx/FxParticleSystem";
import { VEC2, vec2, VEC2_ZERO } from "../fx/vec2";
import { LOGI } from "../logs";
import { INTRA_RADIUS } from "../MainConstants";
import { cos, RAD, sin } from "../math";

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

    forward( pSys: FxParticleSystem ): Array<FxParticle>
    {
        const particles = new Array<FxParticle>();
        const prev_pos = this.pos;

        const dire = VEC2( 
            cos( this.angle ),
            sin( this.angle ),
        );

        const next_pos = this.pos.add( dire.scale( this.step ) );

        {
            const r = this.main_radius;
            const r2 = this.secondary_radius;
            const inner_dist = this.step - 2 * r - 2 *r2;
            
            const start_pos = this.pos.add( dire.scale( r + r2 ) );
            const end_pos = start_pos.add( dire.scale( inner_dist )) ;
            
            const l = Math.floor( inner_dist / (2*r2) );

            let prev_chain = this.last_part;

            for ( let i=0; i<l; ++i )
            {
                const p = start_pos.lerp( end_pos, i / (l-1) );
                const v = pSys.addParticle( p, r2 );

                if ( prev_chain<0)
                {

                }
                else
                {
                    const L =  pSys.getRadius(prev_chain)  +  r2; 
                    pSys.addConstraint( FxLinkConstraint( prev_chain, v, L, 2 *L ));
                }

                prev_chain = v;
                particles.push(v);
            }
        }

        this.pos = next_pos;
        const u = pSys.addParticle( this.pos, this.main_radius );
        particles.push(u);

        const axis_constraint = (this.last_part<0)
            ? FxAngle1PConstraint( u, prev_pos, dire, RAD(30) )
            : FxAngle2PConstraint( u, this.last_part, dire, RAD(30) );

        pSys.addConstraint( axis_constraint );

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
