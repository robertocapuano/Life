import { FxParticle } from "../fx/FxParticle";
import { CIRCLE_CLR, MAIN_RADIUS, SECS } from "../MainConstants";
import { abs, cos, min, PI } from "../math";
import { TTWORLD } from "../WorldRefs";

const ANIM_TICKS = 1 / SECS(1);

interface Cell
{
    idx: FxParticle;
    isTerm: boolean;
    t: number;
}

export class Cellular
{
    private cells: Array<Cell>;

    constructor(
    ) {
    }

    setup()
    {   
        this.cells = new Array<Cell>();
        
        const n = TTWORLD.pSys.count();
        for ( let idx=0; idx<n; ++idx )
        {
            const r = TTWORLD.pSys.getRadius(idx);
            const isTerm = (r === MAIN_RADIUS);
            const t = 1;

            this.cells.push({
                idx,
                isTerm,
                t,
            });
        }

    }

    update()
    {
        this.life();
        this.drawCircles();
    }

    getCellular( idx: number ): Cell
    {
      return this.cells[idx];
    }

    private life()
    {
      const { pSys, flow } = TTWORLD;
      const count = pSys.count();

      for ( let i = 0; i < count; i++ )
      {
        const p_pos = pSys.getPos( i );
        const r = pSys.getRadius( i );
        const bkt = flow.getParts( p_pos );
        if (!!bkt.length)
        {
          // LOGI(`${bkt.length}`);

          for ( let prt of bkt )
          {
            if (prt.pos_sta.sub( p_pos ).mag()<r)
              flow.newPart(prt);
          }
          if (this.cells[i].t>=1)
          {
            this.cells[i].t= 0;
          }
        }
      }
    }

  /**
   * Draw the outlines of the circles.
   */
  private drawCircles( )
  {
    const { pSys } = TTWORLD;
    const color = CIRCLE_CLR;
    const { ctx } = TTWORLD;
    ctx.strokeStyle = color;
    const count = pSys.count();

    for ( let i = 0; i < count; i++ )
    {
      const c = pSys.getPos(i);
      if (!c) 
        continue;

      const r = pSys.getRadius(i);

      const s = .7 + .3 * abs(cos( this.cells[i].t * PI ));
      this.cells[i].t = min( this.cells[i].t+ANIM_TICKS, 1 );
      // const z = easeOutQuad(s);

      ctx.beginPath();
      ctx.arc( c.x, c.y, s * r, 0, 2 * Math.PI );
      ctx.strokeStyle = 'white';//'#0096ff';//'#9437ff';
     
      ctx.fillStyle = '#942193';
      ctx.stroke();
     
    }
  };
}
