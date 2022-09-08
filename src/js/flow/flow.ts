import { ONE_SEC } from "../fx/FxParticle";
import { VEC2, vec2 } from "../fx/vec2";
import { HEIGHT, SECS, WIDTH } from "../MainConstants";
import { randomDir, RND01 } from "../random";
import { Noise } from "./noise";

const VEL_SCALE = .4 * ONE_SEC;
const ADV_SCALE = .8 * ONE_SEC;
const W_STEP = 1/ONE_SEC;
const TAIL_SCALE = 4;

const TTL = SECS(10);

enum FlowType {
    Source,
    Attractor,
    Sink,
};

interface FlowGate
{
    pos: vec2;
    type: FlowType;
    prog: number;
}

interface FlowPart
{
    pos_sta: vec2;
    vel_sta: vec2;

    pos_end: vec2;

    ttl_sta: number;
    ttl_now: number;
}

export class Flow
{
    gates: Array<FlowGate>;
    noise = new Noise();
    adv: vec2;
    parts: Array<FlowPart>;

    constructor(
    ) {
    }
    
    setup()
    {
        this.gates = [];
        
        this.adv = randomDir().scale( ADV_SCALE );
        
        this.parts = [];

        const N = 50;

        for ( let i=0; i<N; ++i )
        {
            const part = {} as FlowPart;

            this.newPart( part );
            this.parts.push( part );
        }
    }

    update( canvas: HTMLCanvasElement )
    {
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;

        ctx.beginPath();     
        ctx.arc(WIDTH*.3, HEIGHT*.4, 50, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.strokeStyle = 'white';

        this.parts.forEach( part => {
            const isLive = this.advPart( part );
            
            if (!isLive)
                this.newPart( part );
                
            ctx.beginPath();     
            ctx.moveTo(part.pos_sta.x, part.pos_sta.y);  
            ctx.lineTo(part.pos_end.x, part.pos_end.y ); 
            ctx.stroke();     

         
        });
    }

    private newPart( part: FlowPart )
    {
        // const pos_sta = VEC2( RND01() * WIDTH*.1+ WIDTH*.1, RND01() * HEIGHT*.1+ HEIGHT*.1 );//   QU.rotate( rot_sta, this.mainAxis ).scale(HSCALE);
        const pos_sta = VEC2( RND01() * WIDTH*.2+ WIDTH*.2, RND01() * HEIGHT*.2+ HEIGHT*.2 );//   QU.rotate( rot_sta, this.mainAxis ).scale(HSCALE);

        const curl = this.noise.computeCurl2( pos_sta );
        const vel_sta = curl.scale(VEL_SCALE);
        const vel_tail = curl.scale( TAIL_SCALE );
        
        // const vel_step = vel_sta.scale( W_STEP );
        const pos_end = pos_sta.add( vel_tail );

        const ttl = TTL *.5 + RND01() * TTL;

        Object.assign( part, {
            pos_sta,
            vel_sta,
            pos_end,

            ttl_sta: ttl,
            ttl_now: ttl,
        } as FlowPart );
        
    }
    
    private advPart( part: FlowPart ): boolean
    {
        if ( --part.ttl_now <=0 )
            return false;

        const vel_step = part.vel_sta.scale( W_STEP );
        const pos_sta = part.pos_sta.add( vel_step );
        
        const curl = this.noise.computeCurl2( pos_sta );
        const vel_sta = this.adv.add( curl.scale(VEL_SCALE) );
        const vel_tail = curl.scale( TAIL_SCALE  );

        const pos_end = pos_sta.add( vel_tail );

        part.pos_sta = pos_sta;
        part.vel_sta = vel_sta;
        part.pos_end = pos_end;

        // Object.assign( part, {
        //     pos_sta,
        //     vel_sta,
        //     pos_end,
        // });
        
      
        return true;
    }



}
