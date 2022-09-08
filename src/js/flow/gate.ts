import { ONE_SEC } from "../fx/FxParticle";
import { VEC2, vec2 } from "../fx/vec2";
import { HEIGHT, SECS, WIDTH } from "../MainConstants";
import { cos, max, PI, sin, TWOPI } from "../math";
import { randomDir, RND01 } from "../random";
import { TTWORLD } from "../WorldRefs";
import { Noise } from "./noise";

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
}

export class Gate
{
    gates: Array<GateFlow>;
    // noise = new Noise();
    // adv: vec2;

    constructor(
    ) {
    }
    
    setup()
    {
        {
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
                    radius: RADIUS  * ( 1 - idx * STEP),
                    active: idx === NGATES-1,
                    disabled: false,
                });
            });
        }
        
    
    }

    update()
    {
      
        this.renderGates();
      
    }

    private renderGates()
    {
        const { ctx } = TTWORLD;

        this.gates.forEach( gate => {
            let r = gate.radius;
            if (gate.active)
            {
                r = gate.radius * .9 + gate.radius * .1 * cos(gate.t * TWOPI);
                gate.t += 1/ONE_SEC;
                if (gate.t>1)
                    gate.t = 0;

                // r *= gate.t;
            }
            ctx.beginPath();     
            ctx.arc(gate.pos.x, gate.pos.y, r, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'white';
            ctx.stroke();
        });
        
    }


}
