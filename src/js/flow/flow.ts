import { ONE_SEC } from "../fx/FxParticle";
import { VEC2, vec2 } from "../fx/vec2";
import { Grid } from "../grid";
import { HEIGHT, SECS, WIDTH } from "../MainConstants";
import { PI, sin } from "../math";
import { randomDir, RND01 } from "../random";
import { TTWORLD } from "../WorldRefs";
import { Noise } from "./noise";

const VEL_SCALE = .4 * ONE_SEC;
const ADV_SCALE = .8 * ONE_SEC;
const W_STEP = 1/ONE_SEC;
const TAIL_SCALE = 4;

const TTL = SECS(10);

interface FlowPart
{
    idx: number;
    pos_sta: vec2;
    vel_sta: vec2;

    pos_end: vec2;

    ttl_sta: number;
    ttl_now: number;
}

export class Flow
{
    private noise = new Noise();
    private adv: vec2;
    private parts: Array<FlowPart>;
    private grid: Grid<number>;

    constructor(
    ) {
        this.grid = new Grid( WIDTH+HEIGHT, 100, false );
    }
    
    setup()
    {
        this.adv = randomDir().scale( ADV_SCALE );
        
        this.parts = [];

        const N = 500;

        for ( let i=0; i<N; ++i )
        {
            const part = { idx: i, } as FlowPart;

            this.newPart( part );
            this.parts.push( part );
            // part.pos_sta = VEC2( 1e5, 1e5);
        }
    }

    teardown()
    {
        this.grid.clear();
        this.parts.length = 0;
    }

    update()
    {
        this.grid.clear();

        this.renderParts();
    }

    getParts( pos: vec2 )
    {
        const bkt = this.grid.getBucket( pos );

        return bkt.map( idx => this.parts[idx] );
    }

    reycleParts( parts: Array<FlowPart> )
    {
        parts.forEach( part => this.newPart( part ) );
    }

    private renderParts()
    {
        const { ctx } = TTWORLD;

        this.parts.forEach( part => {
            const isLive = this.advPart( part );
            
            if (!isLive)
                this.newPart( part );

            const a = sin( part.ttl_now/part.ttl_sta *PI );
            ctx.strokeStyle = `rgba( 255,255,255, ${a} )`;
                
            ctx.beginPath();     
            ctx.moveTo(part.pos_sta.x, part.pos_sta.y);  
            ctx.lineTo(part.pos_end.x, part.pos_end.y ); 
            ctx.stroke();     

        });
    }

    public newPart( part: FlowPart )
    {
        // const pos_sta = VEC2( RND01() * WIDTH*.1+ WIDTH*.1, RND01() * HEIGHT*.1+ HEIGHT*.1 );//   QU.rotate( rot_sta, this.mainAxis ).scale(HSCALE);
        // const pos_sta = VEC2( RND01() * WIDTH*.2+ WIDTH*.2, RND01() * HEIGHT*.2+ HEIGHT*.2 );//   QU.rotate( rot_sta, this.mainAxis ).scale(HSCALE);

        const pos_sta = TTWORLD.gate.getSource();
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

        // const t = 1 - part.ttl_now / part.ttl_sta;

        const adv = TTWORLD.gate.getAdv( part.pos_sta ).scale( ADV_SCALE );

        const vel_step = part.vel_sta.scale( W_STEP );
        const pos_sta = part.pos_sta.add( vel_step );
        
        const curl = this.noise.computeCurl2( pos_sta );
        const vel_sta = adv.add( curl.scale(VEL_SCALE) );
        const vel_tail = curl.scale( TAIL_SCALE  );

        const pos_end = pos_sta.add( vel_tail );

        part.pos_sta = pos_sta;
        part.vel_sta = vel_sta;
        part.pos_end = pos_end;

        this.grid.add( part.idx, part.pos_sta, 1 );

        // Object.assign( part, {
        //     pos_sta,
        //     vel_sta,
        //     pos_end,
        // });
      
        return true;
    }

}
