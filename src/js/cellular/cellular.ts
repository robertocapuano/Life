import { Flow } from "../flow/flow";
import { FxParticle } from "../fx/FxParticle";
import { FxParticleSystem } from "../fx/FxParticleSystem";
import { vec2 } from "../fx/vec2";
import { MAIN_RADIUS } from "../MainConstants";
import { TTWORLD } from "../WorldRefs";

const CIRCLE_CLR = 'white';

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
            const t = 0;

            this.cells.push({
                idx,
                isTerm,
                t,
            });
        }

    }

    update()
    {



    }

     /**
   * Draw the outlines of the circles.
   */
  drawCircles(pSys: FxParticleSystem, color = CIRCLE_CLR )
  {
    const ctx = 
    this._ctx.strokeStyle = color;
    const count = pSys.count();

    for ( let i = 0; i < count; i++ )
    {
      const c = pSys.getPos(i);
      if (!c) continue;

      const r = pSys.getRadius(i);

      this._ctx.beginPath();
      this._ctx.arc(c.x, c.y, r, 0, 2 * Math.PI);
      this._ctx.strokeStyle = 'white';//'#0096ff';//'#9437ff';
      // LOGI(`${this._ctx.fillStyle}`)
      // if (r===MAIN_RADIUS && i< 10)
      //   // this._ctx.lineWidth = 2;
      //   this._ctx.fillStyle = 'purple';//,'purple';
      // else
      this._ctx.fillStyle = '#942193';
      this._ctx.stroke();
      // this._ctx.fill();
      // LOGI(`${this._ctx.fillStyle}`)
      // if (r===MAIN_RADIUS)
      //   this._ctx.stroke();
    }
  };


}
