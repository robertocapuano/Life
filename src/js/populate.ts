import { VEC2 } from "./fx/vec2";
import { LSystem } from "./lsys/LSystem";
import { Turtle } from "./lsys/Turtle";
import { FORWARD_STEP, HEIGHT, INTRA_RADIUS, MAIN_RADIUS, WIDTH } from "./MainConstants";
import { cos, RAD, sin, TWOPI } from "./math";
import { TTWORLD } from "./WorldRefs";

export const populate = [

() =>
{
    const lSys = new LSystem(new Map<string,string>([
        ['F', 'F[+F]F[-F]F'],

        ]),
    );

    {
        const word = lSys.applyProd('F',2);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5, HEIGHT ), 
            RAD(-90), 
            FORWARD_STEP, 
            RAD(40),  
        );
        lSys.applyTurtle( turtle, word, TTWORLD.pSys, );
    }


},
()=> {
    const lSys = new LSystem(new Map<string,string>([
        ['F', 'F[+F]F[-F]F'],

        ]),
    );

    {
        const word = lSys.applyProd('F',2);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5, HEIGHT ), 
            RAD(-90), 
            FORWARD_STEP, 
            RAD(90),  
        );
        lSys.applyTurtle( turtle, word, TTWORLD.pSys, );
    }



},
() => {
    const lSys = new LSystem(new Map<string,string>([
            ['X','F[+X]F[-X]+X'],
        ['F','FF'],


        ]),
    );

    {
        const word = lSys.applyProd('X',2);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5, HEIGHT ),  RAD(-90), 
            FORWARD_STEP,   RAD(70),  
        );
        lSys.applyTurtle( turtle, word, TTWORLD.pSys, );
    }

    {
        const word = lSys.applyProd('X',2);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5, 0 * HEIGHT ), RAD(90), 
            FORWARD_STEP,  RAD(70),  
        );
        lSys.applyTurtle( turtle, word, TTWORLD.pSys, );
    }

    
},
()=>{
    const N = 6;

    const lSys = new LSystem(new Map<string,string>([
        ['F', 'F[+F]F[-F]F'],

        ]),
    );
    const word = lSys.applyProd('F',1);

    for ( let i=0; i<N; ++i )
    {
        const angle = TWOPI/N* i;
        const R = 0;//50;

        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2( WIDTH * .5 + R * cos(angle), .5 * HEIGHT + R * sin(angle) ),// VEC2(,  ), 
            angle,  
            FORWARD_STEP, 
            RAD(60),  
        );
        lSys.applyTurtle( turtle, word, TTWORLD.pSys, );
    }
   
},


() =>
{
    const lSys = new LSystem(new Map<string,string>([

        
            ['X', 'F[+X][-X]FX'],
        ['F','FF'],

        ]),
    );

    for ( let i=0; i<3; ++i )
    {
        const word = lSys.applyProd('X',2);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5 * i, HEIGHT),   RAD(-45)*(i+1),
            FORWARD_STEP, RAD(40),
        );
        lSys.applyTurtle( turtle, word, TTWORLD.pSys, );
    }

},

() => {
    const lSys = new LSystem(new Map<string,string>([

           ['X', 'F[+X][-X]FX'],
        ['F','FF'],

        ]),
    );

    {
        const word = lSys.applyProd('X',3);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5, HEIGHT ), 
            RAD(-90), 
            FORWARD_STEP, 
            RAD(35),  
        );
        lSys.applyTurtle( turtle, word, TTWORLD.pSys, );
    }

},

];