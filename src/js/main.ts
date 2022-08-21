import { FxParticleSystem } from "./fx/FxParticleSystem";
import { metaball } from "./marching-square/metaball";
import { MarchingSquare } from "./marching-square/marching-square";
import { VEC2 } from "./fx/vec2";
import { FxConstantForce } from "./fx/FxForces";
import { ONE_SEC } from "./fx/FxParticle";

(() =>
{

    const width = 700;
    const height = 500;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    const pSys = new FxParticleSystem();
    pSys.setUp();
    const i = pSys.addParticle( VEC2( 40, 40 ), 14 );
    pSys.addParticle( VEC2( 60, 60 ) );
    pSys.addTmpForce( FxConstantForce( i, VEC2( 1, 2 ).scale( ONE_SEC ) ));

    const sim = new MarchingSquare({
        canvas: canvas,
        cellSize: 5,
        threshold: 1,
        draw: function ()
        {
            this.drawBg();
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

})();
