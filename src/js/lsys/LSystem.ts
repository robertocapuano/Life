import { FxParticleSystem } from "../fx/FxParticleSystem";
import { Production } from "./Production";
import { Turtle } from "./Turtle";
import { Symbols } from './Symbols';

export class LSystem
{
    word: string;
    stack: Array<Turtle>;

    constructor( 
        public rules: Array<Production>,
        public turtle: Turtle,
        public omega: string,
    ) {
        this.word = omega;
        this.stack = [];
    }

    applyProd()
    {
    }

    applyTurtle( pSys: FxParticleSystem )
    {
        for ( const c of this.word )
        {
            switch (c)
            {
                case Symbols.Forward:
                {
                    break;
                }
                case Symbols.Push:
                {
                    break;
                }
                case Symbols.Pop:
                {
                    break;
                }
                case Symbols.Right:
                {
                    break;
                }
                case Symbols.Left:
                {
                    break;
                }
            }
        }
    }

}
