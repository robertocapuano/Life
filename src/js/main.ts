import { FxConstantForce } from "./fx/FxForces";
import { ONE_SEC } from "./fx/FxParticle";
import { FxParticleSystem } from "./fx/FxParticleSystem";
import { VEC2 } from "./fx/vec2";
import { LOGI } from "./logs";
import { LSystem } from "./lsys/LSystem";
import { Turtle } from "./lsys/Turtle";
import { MAIN_RADIUS, FORWARD_STEP, HEIGHT, INTRA_RADIUS, WIDTH } from "./MainConstants";
import { MarchingSquare } from "./marching-square/marching-square";
import { metaball } from "./marching-square/metaball";
import { RAD } from "./math";
import { randomDir, RND0N } from "./random";
import { initUi, UserSlash } from "./ui";

(() => {

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    const slashUi = new UserSlash( canvas, (x: number, y: number ) =>{
        LOGI(`[${x},${y}]`);
    });

    const pSys = new FxParticleSystem();
    pSys.setUp();

    {
        const lSys = new LSystem(new Map<string,string>([
            ['F','F[+F]F[-F]F'],
            ]),
        );

        const word = lSys.applyProd('F',2);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5, HEIGHT ), 
            RAD(-90), 
            FORWARD_STEP, 
            RAD(45),  
        );
        lSys.applyTurtle( turtle, word, pSys, );


        const noise_fn = () => {
            const n = pSys.count();

            const u = RND0N(n);

            pSys.addTmpForce( FxConstantForce( u, randomDir().scale( 2 * ONE_SEC) ) );

        };

        setInterval( noise_fn, 1000 );

    }

    {
        const sim = new MarchingSquare({
            canvas: canvas,
            cellSize: 5,
            threshold: 1,
            draw: function ()
            {
                this.drawBg();
                this.drawCircles(pSys);
                // this.drawGridLines();
                this.drawSmoothContours();
            },
        });

        const update = () =>
        {
            pSys.update();
            sim.recalculate( (x: number, y: number) => metaball(x, y, pSys) );
            sim.draw();

            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }

})();
