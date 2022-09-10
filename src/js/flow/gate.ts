import { ONE_SEC } from "../fx/FxParticle";
import { VEC2, vec2, VEC2_ZERO } from "../fx/vec2";
import { VEC3_ZERO } from "../fx/vec3";
import { Grid } from "../grid";
import { HEIGHT, SECS, WIDTH } from "../MainConstants";
import { cos, min, PI, POW2, sin, sqrt, TWOPI } from "../math";
import { randomDir, RND01 } from "../random";
import { TTWORLD } from "../WorldRefs";

const PULSE_TICKS = 1/SECS(2);

const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const CELL_SIZE = CELL_WIDTH * CELL_HEIGHT;

const COLS = Math.trunc(WIDTH/CELL_WIDTH);
const ROWS = Math.trunc(HEIGHT/CELL_HEIGHT);

enum GateType {
    Source,
    Attractor,
    Sink,
};

interface GateFlow
{
    pos: vec2;
    adv: vec2;
    type: GateType;
    prog: number;
    t: number;
    radius: number;
    active: boolean;
    disabled: boolean;
    delta: number;
}
export class Gate
{
    private gates: Array<GateFlow>;
    // noise = new Noise();
    private selected: GateFlow;

    private grid: Grid<vec2>;

    constructor(
    ) {
        this.grid = new Grid<vec2>( WIDTH * HEIGHT/ CELL_SIZE, CELL_SIZE, false );
    }
    
    setup()
    {
        this.grid.clear();

        this.gates = [];
        
        const pos = VEC2(WIDTH*.3, HEIGHT*.4);
        const adv = randomDir();
        
        const types = [ GateType.Source, GateType.Attractor, GateType.Attractor, GateType.Sink ];
        const NGATES = types.length;

        const RADIUS = 50;
        const STEP = .1;

        types.forEach( (type, idx ) => {
            this.gates.push({
                pos,
                adv,
                type,
                prog: idx,
                t: 1,
                radius: RADIUS  * (1 - idx * STEP),
                active: false,//idx === NGATES-1,
                disabled: false,
                delta: idx * TWOPI / (NGATES-1),
            });
        });

        this.selected = this.gates[NGATES-1];
    }

    update()
    {
        this.renderGates();
    }

    selectAt( pos: vec2 ): boolean
    {
        for ( let gate of this.gates.slice(0).reverse() )
        {
            const dist = gate.pos.sub( pos ).mag();

            if (dist<gate.radius)
            {
                this.selected = gate;
                
                return true;
            }
        }

        this.selected = null;
        return false;
    }

    // private select( gate: GateFlow )
    // {
    //     if (!!this.selected)
    //     {
    //         this.selected.active = false;
    //         this.selected = null;
    //     }

    //     gate.active = true;
    //     this.selected = gate;
    // }

    moveTo( dest: vec2 ): boolean
    {
        if (!this.selected)
            return false;

        this.selected.pos = dest;

        this.compGrid();

        return true;
    }

    getSource()
    {
        const { pos } = this.gates[0];
        const r = this.gates[0].radius * RND01();
        const alpha = RND01() * TWOPI;

        const src = VEC2(  pos.x + r * cos(alpha), pos.y + r * sin(alpha)   );

        return src;
    }

    getAdv( pos: vec2 ): vec2
    {
        const b = this.grid.getBucket( pos );
        return b[0] ?? VEC2_ZERO();

        // const step = 1 / this.gates.length;
        // const l = this.gates.length-1;
        // const i = min( t * this.gates.length, l);
        // const j = min( i+1, l );

        // this.gates[i].pos.sub( this.gates[j].pos ).normalize().scale( 

        // const alpha = t * TWOPI;

        // const dire = VEC2_ZERO();

        // this.gates.forEach( (gate) => {
        //     const w = cos(  gate.delta - alpha ) ;
        //     dire.addInPlace( gate.adv.scale(w) );
        // });

        // return dire;
    }

    private compGrid()
    {
        this.grid.clear();
        const pos = VEC2_ZERO();

        for ( let i=0; i<ROWS; ++i )
        {
            for ( let j=0; j<COLS; ++j )
            {
                pos.x = (i+.5) * CELL_WIDTH;
                pos.y = (j+.5) * CELL_HEIGHT

                const adv = this.compAdv( pos );
                const bkt = this.grid.getBucket(pos);
                if (!bkt.length)
                    bkt.push( VEC2_ZERO() );
                    // this.grid.add( adv, pos, WIDTH );

                // bkt[0] = adv.mag()>bkt[0].mag() ? adv : bkt[0];// .addInPlace( adv );
                bkt[0].addInPlace( adv );
            }
        }

        // // this.gates[0].adv = randomDir();
        // const EPS = 1;

        // for ( let i=1; i<this.gates.length; ++i )
        // {
        //     const diff = this.gates[i].pos.sub(  this.gates[i-1].pos );
        //     const dist = diff.mag();
        //     const dire = (dist<EPS) ? randomDir() : diff.normalize();
           
        //     this.gates[i].adv = dire;
        // }

        // this.gates[0].adv = this.gates[1].adv.clone();
    }

    private compAdv( pos: vec2 ): vec2
    {
        const MAG = 1e-2;
        const adv = VEC2_ZERO()

        for ( const gate of this.gates )
        {
            const diff = gate.pos .sub( pos );
           
            if (gate.type === GateType.Source )
                diff.negateInPlace();

            const dist = diff.mag();

            const dire = diff.normalize();
         
            const mag = ( (gate.prog+1)*MAG ) / sqrt(dist);//(gate.prog+1)*.2+

            const adv_g = dire.scale(mag);
            adv.addInPlace( adv_g )
        }

        return adv;
    }

    private renderGates()
    {
        const { ctx } = TTWORLD;

        this.gates.forEach( gate => {
            let r = gate.radius;
            if (gate.active)
            {
                // const fn = gate.type === GateType.Source ? cos : sin;
                r = gate.radius * .9 + gate.radius * .1 * sin(gate.t * TWOPI);
                gate.t += PULSE_TICKS;
                if (gate.t>1)
                    gate.t = 0;
            }
            ctx.beginPath();     
            ctx.arc(gate.pos.x, gate.pos.y, r, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'white';
            ctx.stroke();
        });
        
    }


}
