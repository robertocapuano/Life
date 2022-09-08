import { FxParticle } from "../fx/FxParticle";
import { CIRCLE_CLR, MAIN_RADIUS } from "../MainConstants";
import { TTWORLD } from "../WorldRefs";

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
        this.drawCircles();

        
    }

    private ai()
    {


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
      if (!c) continue;

      const r = pSys.getRadius(i);

      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, 2 * Math.PI);
      ctx.strokeStyle = 'white';//'#0096ff';//'#9437ff';
      // LOGI(`${this._ctx.fillStyle}`)
      // if (r===MAIN_RADIUS && i< 10)
      //   // this._ctx.lineWidth = 2;
      //   this._ctx.fillStyle = 'purple';//,'purple';
      // else
      ctx.fillStyle = '#942193';
      ctx.stroke();
      // this._ctx.fill();
      // LOGI(`${this._ctx.fillStyle}`)
      // if (r===MAIN_RADIUS)
      //   this._ctx.stroke();
    }
  };


}
