import { FxParticleSystem } from "../fx/FxParticleSystem";
import { Symbols } from './Symbols';
import { Turtle } from "./Turtle";

export class LSystem
{
    constructor( 
        public rules: Map<string,string>,
    ) {
    }

    applyProd( omega: string, n: number = 1 ): string
    {
        let w0 = '';
        let w1 = omega;

        for ( let i=0; i<n; ++i )
        {
            w0 = w1;
            w1 = '';

            for ( const c of w0 )
            {
                if ( this.rules.has(c) )
                    w1 += this.rules.get(c)
                else
                    w1 += c;
            }
        }

        return w1;
    }

    applyTurtle( 
                turtle: Turtle, 
                word: string, 
                pSys: FxParticleSystem,  
    ) {
        const stack = new Array<Turtle>();

        for ( const c of word )
        {
            switch (c)
            {
                case Symbols.Forward:
                {
                    turtle.forward(pSys);
                    break;
                }
                case Symbols.Push:
                {
                    stack.push( turtle );
                    turtle = turtle.fork();

                    break;
                }
                case Symbols.Pop:
                {
                    const top = stack[stack.length-1];
                    stack.pop();
                    turtle = top;

                    break;
                }
                case Symbols.Right:
                {
                    turtle.right();

                    break;
                }
                case Symbols.Left:
                {
                    turtle.left();
                    break;
                }
            }
        }
    }

}
