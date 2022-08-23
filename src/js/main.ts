import { FxParticleSystem } from "./fx/FxParticleSystem";
import { metaball } from "./marching-square/metaball";
import { MarchingSquare } from "./marching-square/marching-square";
import { VEC2 } from "./fx/vec2";
import { FxConstantForce } from "./fx/FxForces";
import { ONE_SEC } from "./fx/FxParticle";
import { HEIGHT, WIDTH } from "./MainConstants";
import * as Creatures from './creatures/creatures';
import { LSystem } from "./lsys/LSystem";
import { Turtle } from "./lsys/Turtle";
import { RAD } from "./math";

(() =>
{

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    const pSys = new FxParticleSystem();
    pSys.setUp();

    // Creatures.createSkeleton( pSys );
    {
        const lSys = new LSystem(new Map<string,string>([
            ['F','FFF'],
            ]),
        );

        const word = lSys.applyProd('F');
        const turtle = new Turtle( VEC2(WIDTH * .5, HEIGHT * .5 ), 30, RAD(45),  );
        lSys.applyTurtle(turtle, word, pSys, );
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
