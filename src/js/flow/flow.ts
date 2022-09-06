import { VEC2, vec2 } from "../fx/vec2";
import { HEIGHT, SECS, WIDTH } from "../MainConstants";
import { randomDir, RND01 } from "../random";
import { Noise } from "./noise";

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
    noise = new Noise();
    adv: vec2;

    constructor(
    ) {

        this.adv = randomDir();
    }

    private newPart( part: FlowPart )
    {
        // const HSCALE = CONSTS.ATMO_WIND_HEIGHT;

        // const rotAxis = this.getRotAxis();
        
        // const rotAngle = RND01() * ROT_ANGLE_MAX;

        // const rot_sta = QU.angleAxis( rotAngle, rotAxis );
        const pos_sta = VEC2( RND01() * WIDTH, RND01() * HEIGHT );//   QU.rotate( rot_sta, this.mainAxis ).scale(HSCALE);
        
        const ADV_SCALE = 5;

        const adv = this.adv.scale( ADV_SCALE ); // TODO common
        const curl = this.noise.computeCurl2( pos_sta );
        
        // const ome_sta = adv.scale(ADV_STEP).add( curl.scale(CURL_STEP) );
        
        // ////
        // const rot_end = rot_sta.clone();
        // rot_end.addInPlace( QUAT( ome_sta.x, ome_sta.y, ome_sta.z, 0 )
        //         .multiplyInPlace( rot_end ) .scaleInPlace( .5 ) ).normalize();

        const pos_end = pos_sta.add( curl );//  QU.rotate( rot_end, this.mainAxis ).scale( HSCALE );
        
        const ttl = SECS(1) + RND01() * SECS(5);

        Object.assign( part, {
            pos_sta,
            
            pos_end,

            ttl_sta: ttl,
            ttl_now: ttl,
        } as FlowPart );
        
    }
    
    private advPart( part: FlowPart ): boolean
    {
        if ( --part.ttl_now <=0 )
            return true;
        
        const HSCALE = CONSTS.ATMO_WIND_HEIGHT;
        
        {
            const W_STEP = 1 / SECS(1);
            
            const ome_sta_f = part.ome_sta.scale( W_STEP );
            part.rot_sta.addInPlace( QUAT( ome_sta_f.x, ome_sta_f.y, ome_sta_f.z, 0 ).multiplyInPlace( part.rot_sta ) .scaleInPlace( .5 ) ).normalize(); 
            part.pos_sta = QU.rotate( part.rot_sta, this.mainAxis ).scaleInPlace(HSCALE);
            
            const adv = this.adv.scale( DIRE_ANGLE ); // TODO ADVECTION common
            const curl = this.noise.computeCurl3( part.pos_sta );
            const cc = curl.scale(CURL_STEP);
            
            {
                const mm = mag(cc);
                const GLITCH = 25e-2;
                if ( mm > GLITCH )
                    return true;
            }

            part.ome_sta = adv.scale(ADV_STEP).add( cc );
        }
        
        {
            const rot_end = part.rot_sta.clone();
            rot_end.addInPlace( QUAT( part.ome_sta.x, part.ome_sta.y, part.ome_sta.z, 0 ).multiplyInPlace( rot_end ) .scaleInPlace( .5 ) ).normalize();
            part.pos_end = QU.rotate( rot_end, this.mainAxis ).scaleInPlace(HSCALE);
        }    

        return false;
    }



}
