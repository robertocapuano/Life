import { drawBg } from "./bg";
import { Cellular } from "./cellular/cellular";
import { Flow } from "./flow/flow";
import { Gate } from "./flow/gate";
import { FxConstantForce } from "./fx/FxForces";
import { ONE_SEC } from "./fx/FxParticle";
import { FxParticleSystem } from "./fx/FxParticleSystem";
import { VEC2 } from "./fx/vec2";
import { Intro, intro } from "./intro";
import { HEIGHT, WIDTH } from "./MainConstants";
import { MarchingSquare } from "./marching-square/marching-square";
import { metaball } from "./marching-square/metaball";
import { populate } from "./populate";
import { RND0N, RND11 } from "./random";
import { UserSlash } from "./user-slash";
import { TTWORLD } from "./WorldRefs";

( async () =>  {

   

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    TTWORLD.canvas = canvas;
    TTWORLD.ctx = ctx;

    TTWORLD.pSys = new FxParticleSystem();
    TTWORLD.pSys.setUp();
    
    TTWORLD.gate = new Gate();
    TTWORLD.gate.setup();
    
    TTWORLD.flow = new Flow();
    TTWORLD.flow.setup();

    TTWORLD.cellular = new Cellular();

    TTWORLD.sim = new MarchingSquare({
        cellSize: 5,
        threshold: 1,
    });

    TTWORLD.slashUi = new UserSlash();
    TTWORLD.slashUi.setup();
    TTWORLD.slashUi.isPlay = false;

    TTWORLD.intro = new Intro( () => {
        TTWORLD.slashUi.isPlay = true;
        TTWORLD.gate.align();

        const populate_fn = populate[ RND0N( populate.length) ]; //populate.length-1];//
        populate_fn();
        
        TTWORLD.cellular.setup();
        
        noise();
    });

    gameloop();


})();

function noise()
{

    const noise_fn = () => {
        const n = TTWORLD.pSys.count();

        const u = RND0N(n);

        const cell = TTWORLD.cellular.getCellular(u);

        const delta = 10 * (1-cell.t) * ONE_SEC;
        TTWORLD.pSys.addTmpForce( FxConstantForce( u, VEC2( RND11() * 5 * ONE_SEC, delta ) ) );//randomDir().scale( 2 * ONE_SEC) ) );

    };

    setInterval( noise_fn, 1000 );

}

function gameloop()
{
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
