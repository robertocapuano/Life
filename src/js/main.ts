import { drawBg } from "./bg";
import { Cellular } from "./cellular/cellular";
import { Flow } from "./flow/flow";
import { Gate } from "./flow/gate";
import { FxConstantForce } from "./fx/FxForces";
import { ONE_SEC } from "./fx/FxParticle";
import { FxParticleSystem } from "./fx/FxParticleSystem";
import { VEC2 } from "./fx/vec2";
import { LSystem } from "./lsys/LSystem";
import { Turtle } from "./lsys/Turtle";
import { FORWARD_STEP, HEIGHT, INTRA_RADIUS, MAIN_RADIUS, WIDTH } from "./MainConstants";
import { MarchingSquare } from "./marching-square/marching-square";
import { metaball } from "./marching-square/metaball";
import { RAD } from "./math";
import { RND0N, RND11 } from "./random";
import { UserSlash } from "./user-slash";
import { TTWORLD } from "./WorldRefs";

(() => {

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    // const slashUi = new UserSlash( canvas, ( points: Array<vec2> )=>{
    //     // LOGI(`points [${points}]`);
    //     // const ps = new Set<FxParticle>();

    //     // points.forEach( pnt => {
    //     //     const p = pSys.getParticleAt( pnt );
    //     //     if (!!p)
    //     //         ps.add( p );
    //     // });
    //     // LOGI(`ps: ${ps}`);

    //     // ps.forEach( p => pSys.removeConstraints( p ) );

    //     // ps.forEach( p => pSys.addForce( FxConstantForce( p, VEC2( 0, +10 ) ) ) );
    // },
    // ( p: FxParticle, pos: vec2 ) => {
    //     // drag
    // },
    // ( p: FxParticle ) => {
    //     // split
    // },
    // );

    TTWORLD.canvas = canvas;
    TTWORLD.ctx = ctx;

    TTWORLD.pSys = new FxParticleSystem();
    TTWORLD.pSys.setUp();

    TTWORLD.flow = new Flow();
    TTWORLD.flow.setup();
    
    TTWORLD.gate = new Gate();
    TTWORLD.gate.setup();

    TTWORLD.cellular = new Cellular();

    TTWORLD.sim = new MarchingSquare({
        cellSize: 5,
        threshold: 1,
    });

    TTWORLD.slashUi = new UserSlash();
    TTWORLD.slashUi.setup();

    TTWORLD.cellular.setup();

    populate();
    
    noise();

    gameloop();
    

})();


function populate()
{
    const lSys = new LSystem(new Map<string,string>([
        ['F', 'F[+F]F[-F]F'],
/*            ['X','F[+X]F[-X]+X'],
        ['F','FF'],
*/
        // ['F','FF[-F+F+F]+[+F-F-F]'],

        // ['F', 'F[+F]F[-F][F]'],
/*            ['X', 'F[+X][-X]FX'],
        ['F','FF'],
*/
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


    // {
    //     const word = lSys.applyProd('F',1);
    //     const turtle = new Turtle( 
    //         MAIN_RADIUS,
    //         INTRA_RADIUS,
    //         VEC2(WIDTH * .5, 0 ), 
    //         RAD(+90), 
    //         FORWARD_STEP, 
    //         RAD(35),  
    //     );
    //     lSys.applyTurtle( turtle, word, pSys, );
    // }
}

function noise()
{

    const noise_fn = () => {
        const n = TTWORLD.pSys.count();

        const u = RND0N(n);

        TTWORLD.pSys.addTmpForce( FxConstantForce( u, VEC2( RND11() * 5 * ONE_SEC, 0 ) ) );//randomDir().scale( 2 * ONE_SEC) ) );

    };

    setInterval( noise_fn, 1000 );

}

function gameloop()
{
    // const sim = new MarchingSquare({
    //     cellSize: 5,
    //     threshold: 1,
    //     // draw:  () =>
    //     // {
    //     //     sim.drawCircles(pSys);
    //     //     // this.drawGridLines();
    //     //     sim.drawSmoothContours();
    //     // },
    // });

    const update = () =>
    {
        drawBg();

        TTWORLD.pSys.update();
        TTWORLD.gate.update();
        TTWORLD.flow.update();
        TTWORLD.cellular.update();

        TTWORLD.sim.recalculate( (x: number, y: number) => metaball(x, y ) );
        TTWORLD.sim.drawSmoothContours();
        // TTWORLD.drawCircles(TTWORLD.pSys);

        requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
}
