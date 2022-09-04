import { FxParticle } from "./fx/FxParticle";
import { VEC2, vec2 } from "./fx/vec2";

// https://npm.io/package/tinygesture

const SPLIT_DIST = 50;

export class UserSlash
{
    private prevX = 0;
    private currX = 0;
    private prevY = 0;
    private currY = 0;
    
    private x = "black";
    private y = 2;
    
    private flag = false;
    private particles = new Array<vec2>();

    private dragging: FxParticle = null;

    constructor(
        public canvas: HTMLCanvasElement,  
        private callback: ( particles: Array<vec2> ) => void,
        private drag: ( p: FxParticle, pos: vec2 ) => void,
        private split: ( p: FxParticle ) => void,
    ) {
        // let ctx: CanvasRenderingContext2D  = null
    
        // ctx = canvas.getContext('2d');
    
        canvas.addEventListener("mousemove", (e) => {
            this.findxy( 'move', e);
        }, false);
        canvas.addEventListener("mousedown", (e) => {
            this.findxy(  'down', e);
        }, false);
        canvas.addEventListener("mouseup", (e) => {
            this.findxy(  'up', e);
        }, false);
        canvas.addEventListener("mouseout", (e) => {
            this.findxy(  'out', e);
        }, false);
    
    }


    private findxy( res: string, e: any )
    {
        if (res === 'down') {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = e.clientX - this.canvas.offsetLeft;
            this.currY = e.clientY - this.canvas.offsetTop;

            this.flag = true;
            this.particles.length = 0;
            this.particles.push( VEC2( this.currX, this.currY) );

            // dot_flag = true;
            // if (dot_flag) 

            // {
            //     let ctx: CanvasRenderingContext2D  = null
            //     ctx = this.canvas.getContext('2d');
            //     ctx.beginPath();
            //     ctx.fillStyle = this.x;
            //     ctx.fillRect(this.currX, this.currY, 2, 2);
            //     ctx.closePath();
            // }
        }
        if (res==='up')
        {

            if (this.flag)
                this.callback(this.particles );

            this.flag = false;
        }

        if ( res == "out") {
            this.flag = false;
        }
        if (res == 'move') {
            if (this.flag) {
                this.prevX = this.currX;
                this.prevY = this.currY;
                this.currX = e.clientX - this.canvas.offsetLeft;
                this.currY = e.clientY - this.canvas.offsetTop;
                this.particles.push( VEC2( this.currX, this.currY) );

                // this.draw(this.canvas);
            }
        }
    }

    private draw(canvas:HTMLCanvasElement,) {
        // let ctx: CanvasRenderingContext2D  = null
        // ctx = canvas.getContext('2d');
        
        // ctx.beginPath();
        // ctx.moveTo(this.prevX, this.prevY);
        // ctx.lineTo(this.currX, this.currY);
        // ctx.strokeStyle = this.x;
        // // ctx.lineWidth = y;
        // ctx.stroke();
        // ctx.closePath();

    }

}

// let prevX = 0,
//     currX = 0,
//     prevY = 0,
//     currY = 0;


// let flag = false;
// // let ctx: CanvasRenderingContext2D  = null

// export function initUi(canvas: HTMLCanvasElement,  )
// {
//     let ctx: CanvasRenderingContext2D  = null

//     ctx = canvas.getContext('2d');

//     canvas.addEventListener("mousemove", (e) => {
//         findxy( canvas, 'move', e);
//     }, false);
//     canvas.addEventListener("mousedown", (e) => {
//         findxy( canvas, 'down', e);
//     }, false);
//     canvas.addEventListener("mouseup", (e) => {
//         findxy( canvas, 'up', e);
//     }, false);
//     canvas.addEventListener("mouseout", (e) => {
//         findxy( canvas, 'out', e);
//     }, false);

// }

