import { Flow } from "../flow/flow";
import { FxParticle } from "../fx/FxParticle";
import { FxParticleSystem } from "../fx/FxParticleSystem";
import { vec2 } from "../fx/vec2";

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
        private pSys: FxParticleSystem,
        private flow: Flow,
        private mainRadius: number,
        private littleRadius: number,
    ) {
    }

    setup()
    {   
        this.cells = new Array<Cell>();
        
        const n = this.pSys.count();
        for ( let idx=0; idx<n; ++idx )
        {
            const r = this.pSys.getRadius(idx);
            const isTerm = (r === this.mainRadius);
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



}
