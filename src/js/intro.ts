import { Flow } from "./flow/flow";
import { Gate } from "./flow/gate";
import { HEIGHT, WIDTH } from "./MainConstants";
import { TTWORLD } from "./WorldRefs";

export class Intro
{

    constructor(
        private fn: () => void 
    ) {}

    setup( )
    {

        
    }

    teardown()
    {}


    skip()
    {
        this.fn();
    }


}

export function intro(): Promise<void>
{

//     const container = document.createElement("div");
//     // canvas.width = WIDTH;
//     // canvas.height = HEIGHT;
//     document.body.appendChild(container);

//     const content = document.createTextNode("<YOUR_CONTENT>");
//     container.appendChild(content);

//     // container.appendChild( document.createElement
// //     const { canvas, ctx } = TTWORLD;

// //     // const { flow, gate } = TTWORLD;


// //     // TTWORLD.flow = new Flow();
// //     // TTWORLD.gate = new Gate();
// //     // flow.setup();
// //     // gate.setup();

// //    ctx.beginPath();
// //    ctx.fillStyle = '#942193';

// // // //    const gradient = ctx.createLinearGradient(0,HEIGHT, WIDTH*.5,WIDTH*.5);
// // // //    gradient.addColorStop(0, '#9437ff');
// // // //    gradient.addColorStop(.75, '#942193');
// // // //    // gradient.addColorStop(1, '#0096ff');
// // // //    gradient.addColorStop(1, '#ffffff');
// // // //    ctx.fillStyle = gradient;
// //     // ctx.fillRect(0, 0, WIDTH, HEIGHT );
// //     // ctx.beginPath()
// //     // ctx.strokeStyle = 'white';
// //     // ctx.arc( WIDTH*.5, HEIGHT*.5, 50, 0, 2 * Math.PI, false);
// //     // ctx.stroke();
// //     TTWORLD.gate = new Gate();
// //     TTWORLD.gate.setup();
    
// //     TTWORLD.flow = new Flow();
// //     TTWORLD.flow.setup();

// //     TTWORLD.gate.update();
// //     TTWORLD.flow.update();


// return Promise.resolve();
   return new Promise( (rs,rx ) => {
   });

}
