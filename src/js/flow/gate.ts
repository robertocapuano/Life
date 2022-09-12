import { VEC2, vec2, VEC2_ZERO } from "../fx/vec2";
import { Grid } from "../grid";
import { HEIGHT, SECS, WIDTH } from "../MainConstants";
import { cos, sin, sqrt, TWOPI } from "../math";
import { randomDir, RND01, RND0N } from "../random";
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
    // Sink,
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
        
        {
            const pos = VEC2(RND01() * WIDTH*.8 + WIDTH*.1, RND01()  * HEIGHT*.8+ HEIGHT*.1 );
            const adv = randomDir();
            
            const types = [ GateType.Source, GateType.Attractor ];//, GateType.Attractor, GateType.Sink ];
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
                    active: type===GateType.Source,//false,//idx === NGATES-1,
                    disabled: false,
                    delta: idx * TWOPI / (NGATES-1),
                });
            });

            this.selected = this.gates[NGATES-1];
        }
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

    moveTo( dest: vec2 ): boolean
    {
        if (!this.selected)
            return false;

        this.selected.pos = dest;

        this.compGrid();

        return true;
    }

    getSource(): vec2
    {
        const gates = this.gates.filter( gt => gt.type === GateType.Source );

        const gate =  gates[RND0N(gates.length)];
        const { pos } = gate;//this.gates[0];
        const r = this.gates[0].radius * RND01();
        const alpha = RND01() * TWOPI;

        const src = VEC2(  pos.x + r * cos(alpha), pos.y + r * sin(alpha)   );

        return src;
    }

    getAdv( pos: vec2 ): vec2
    {
        const b = this.grid.getBucket( pos );
        return b[0] ?? VEC2_ZERO();
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

                bkt[0].addInPlace( adv );
            }
        }


    }

    private compAdv( pos: vec2 ): vec2
    {
        const MAG = 1e-1;
        const adv = VEC2_ZERO()

        for ( const gate of this.gates )
        {
            const diff = gate.pos .sub( pos );
           
            if (gate.type === GateType.Source )
                diff.negateInPlace();

            const dist = diff.mag();

            const dire = diff.normalize();
         
            const mag = ( MAG ) / sqrt(dist);//(gate.prog+1)*.2+

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
