import { Simulation } from "./marching-square/simulation";

(() => {

    const width = 700;
    const height = 500;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    var base = new Simulation({
        canvas: canvas,
        cellSize: 100,
        numCircles: 10,
        draw: function() {},
        threshold: 1,
        circles: null,
    });

    var smoothHighRes2 = base.clone({
        canvas: null,
        cellSize: 5,
        numCircles: null,
        threshold: null,
        circles: null,
        draw: function() {
            this.drawBg();
            // this.drawGridLines();
            this.drawSmoothContours();
        },
    });

    var tick = function() {
            smoothHighRes2.tickCircles();
            // Only recalculate and draw while the canvas is on the screen.
            smoothHighRes2.recalculate();
            smoothHighRes2.draw();

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

})();
