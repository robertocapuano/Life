import { FxParticleSystem } from "./fx/FxParticleSystem";
import { VEC2 } from "./fx/vec2";
import { LSystem } from "./lsys/LSystem";
import { Turtle } from "./lsys/Turtle";
import { MAIN_RADIUS, FORWARD_STEP, HEIGHT, INTRA_RADIUS, WIDTH } from "./MainConstants";
import { MarchingSquare } from "./marching-square/marching-square";
import { metaball } from "./marching-square/metaball";
import { RAD } from "./math";

(() => {

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    const pSys = new FxParticleSystem();
    pSys.setUp();

    {
        const lSys = new LSystem(new Map<string,string>([
            ['F','F[+F]F[-F]F'],
            ]),
        );

        const word = lSys.applyProd('FF',2);
        const turtle = new Turtle( 
            MAIN_RADIUS,
            INTRA_RADIUS,
            VEC2(WIDTH * .5, HEIGHT ), 
            RAD(-90), 
            FORWARD_STEP, 
            RAD(45),  
        );
        lSys.applyTurtle( turtle, word, pSys, );
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
