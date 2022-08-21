import { cellTypeToPolyCorners } from "./cell-type-to-poly-corners";
import { classifyCells } from "./classify-cells";
import { lerp } from "./lerp";
import { sample } from "./sample";
import { threshold } from "./threshold";

export interface Options
{
  draw: () => void | null;
  canvas: HTMLCanvasElement | null;
  cellSize: number | null;
  threshold: number | null;
}

export class MarchingSquare
{
  draw: () => void;
  _canvas: HTMLCanvasElement;
  _threshold: number;
  _ctx: CanvasRenderingContext2D;
  _cellSize: number;
  // _circles: Array<Circle>;
  _thresholdedSamples: boolean[][];
  _samples: number[][];
  _cellTypes: number[][];


  constructor(options: Options) 
  {
    this.draw = options.draw;

    if (!this.draw)
    {
      throw new Error("Must provide a draw function");
    }

    this._canvas = options.canvas;
    this._cellSize = options.cellSize;
    this._threshold = options.threshold || 1.0;
    this._ctx = this._canvas.getContext('2d');

    //  if (options.circles) {
    //    this._circles = options.circles;
    //  } else {
    //    this._circles = [];
    //    for (var i = 0; i < options.numCircles; i++) {
    //      this._circles.push(this.generateCircle());
    //    }
    //  }
  }

  /**
   * Returns a shallow clone, with properties passed overriding the properties of
   * the instance being cloned.
   */
  //  clone(options: Options) {
  //    return new Simulation({
  //      draw: options.draw || this.draw,
  //      canvas: options.canvas || this._canvas,
  //      cellSize: options.cellSize || this._cellSize,
  //      threshold: options.threshold || this._threshold,
  //      pSys: options.pSys ?? this.pSys,
  //     //  circles: this._circles,
  //     //  numCircles: this._circles.length,
  //    });
  //  }

  //  generateCircle() {
  //     const r= 10 + 10 * Math.random();
  //    const circle = {
  //      x: Math.random() * this._canvas.width,
  //      y: Math.random() * this._canvas.height,
  //      vx: 2 * Math.random() - 1,
  //      vy: 2 * Math.random() - 1,
  //      r,
  //      r2: r * r,
  //    };

  //    return circle;
  //  };

  //  tickCircles() {
  // this.pSys.update();

  //  for (var i = 0; i < this._circles.length; i++) {
  //    var circle = this._circles[i];

  //    if (circle.x + circle.r > this._canvas.width) {
  //      circle.vx = -Math.abs(circle.vx);
  //    } else if (circle.x - circle.r < 0) {
  //      circle.vx = +Math.abs(circle.vx);
  //    }

  //    if (circle.y + circle.r > this._canvas.height) {
  //      circle.vy = -Math.abs(circle.vy);
  //    } else if (circle.y - circle.r < 0) {
  //      circle.vy = +Math.abs(circle.vy);
  //    }

  //    circle.x += circle.vx;
  //    circle.y += circle.vy;
  //  }
  //  }

  recalculate(fn: (x: number, y: number) => number)
  {
    this._samples = sample({
      minX: 0,
      maxX: this._canvas.width,
      stepX: this._cellSize,
      minY: 0,
      maxY: this._canvas.height,
      stepY: this._cellSize,
      fn,
    });

    this._thresholdedSamples = threshold(this._samples, this._threshold);
    this._cellTypes = classifyCells(this._thresholdedSamples);
  };

  //  tick() {
  //    this.tickCircles();
  //    this.recalculate();
  //  };

  /**
   * Draw the background, painting over everything on the canvas.
   */
  drawBg()
  {
    this._ctx.fillStyle = "white";
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  };

  /**
   * Draw the outlines of the circles.
   */
  //  drawCircles(color: string) {
  //    this._ctx.strokeStyle = color || 'green';
  //    for (var i = 0; i < this._circles.length; i++) {
  //      var c = this._circles[i];
  //      this._ctx.beginPath();
  //      this._ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
  //      this._ctx.stroke();
  //    }
  //  };

  /**
   * Draw the corners samples along with the values of those samples.
   */
  drawCornerSamples()
  {
    this._ctx.fillStyle = '#888';
    this._ctx.font = '10px monospace';
    for (var i = 0; i < this._samples.length; i++)
    {
      for (var j = 0; j < this._samples[i].length; j++)
      {
        var sample = this._samples[i][j];

        var x = j * this._cellSize;
        var y = i * this._cellSize;

        this._ctx.fillRect(x - 2, y - 2, 4, 4);
        this._ctx.fillText(("" + sample).substr(0, 4), x + 5, y + 7);
      }
    }
  };

  /**
   * Differentiate cells by drawing those above the threshold and below the
   * threshold in different colors.
   */
  drawThresholdedCells()
  {
    this._ctx.fillStyle = 'green';
    for (var i = 0; i < this._thresholdedSamples.length; i++)
    {
      for (var j = 0; j < this._thresholdedSamples[i].length; j++)
      {
        var thresholdedSample = this._thresholdedSamples[i][j];

        var x = j * this._cellSize;
        var y = i * this._cellSize;

        if (thresholdedSample)
        {
          this._ctx.fillRect(
            Math.floor(x - this._cellSize / 2),
            Math.floor(y - this._cellSize / 2),
            this._cellSize,
            this._cellSize
          );
        }
      }
    }
  };

  /**
   * Differentiate the corners above the threshold and below it by drawing the
   * corners in different colors.
   */
  drawThresholdedCorners()
  {
    this._ctx.fillStyle = '#888';
    for (var i = 0; i < this._thresholdedSamples.length; i++)
    {
      for (var j = 0; j < this._thresholdedSamples[i].length; j++)
      {
        var thresholdedSample = this._thresholdedSamples[i][j];

        var x = j * this._cellSize;
        var y = i * this._cellSize;

        if (thresholdedSample)
        {
          this._ctx.fillStyle = '#0f0';
        } else
        {
          this._ctx.fillStyle = '#888';
        }

        this._ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
  };

  /**
   * Draw the numerical marching squares classification of each cell.
   */
  drawCellClassification()
  {
    this._ctx.fillStyle = '#888';
    this._ctx.font = '10px monospace';
    for (var i = 0; i < this._cellTypes.length; i++)
    {
      for (var j = 0; j < this._cellTypes[i].length; j++)
      {
        var cellType = this._cellTypes[i][j];
        var x = j * this._cellSize + (this._cellSize - 10) / 2;
        var y = i * this._cellSize + (this._cellSize + 10) / 2;

        this._ctx.fillText('' + cellType, x, y);
      }
    }
  };

  /**
   * Draw lines showing the boundaries of each cell.
   */
  drawGridLines(offsetX: number = 0, offsetY: number = 0)
  {
    this._ctx.strokeStyle = '#888';
    for (var x = offsetX || 0; x < this._canvas.width; x += this._cellSize)
    {
      this._ctx.beginPath();
      this._ctx.moveTo(x, 0);
      this._ctx.lineTo(x, this._canvas.height);
      this._ctx.stroke();
    }

    for (var y = offsetY || 0; y < this._canvas.height; y += this._cellSize)
    {
      this._ctx.beginPath();
      this._ctx.moveTo(0, y);
      this._ctx.lineTo(this._canvas.width, y);
      this._ctx.stroke();
    }
  };


  /**
   * Given coordinate pairs in (row, col) format, draw a line on the canvas.
   */
  drawScaledLine(a: number[], b: number[])
  {
    var x0 = a[1] * this._cellSize;
    var y0 = a[0] * this._cellSize;
    var x1 = b[1] * this._cellSize;
    var y1 = b[0] * this._cellSize;

    this._ctx.beginPath();
    this._ctx.moveTo(x0, y0);
    this._ctx.lineTo(x1, y1);
    this._ctx.stroke();
  };

  /**
   * Draw the marching squares contour without linear interpolation.
   */
  draw45DegContours()
  {
    this._ctx.strokeStyle = "green";
    for (var i = 0; i < this._cellTypes.length; i++)
    {
      for (var j = 0; j < this._cellTypes[i].length; j++)
      {
        var cellType = this._cellTypes[i][j];
        var polyCompassCorners = cellTypeToPolyCorners[cellType];

        var compassCoords = {
          "N": [i, j + 0.5],
          "W": [i + 0.5, j],
          "E": [i + 0.5, j + 1.0],
          "S": [i + 1.0, j + 0.5],
        };

        if (polyCompassCorners.length === 2)
        {
          this.drawScaledLine(
            compassCoords[polyCompassCorners[0]],
            compassCoords[polyCompassCorners[1]]
          );
        } else if (polyCompassCorners.length === 4)
        {
          this.drawScaledLine(
            compassCoords[polyCompassCorners[0]],
            compassCoords[polyCompassCorners[1]]
          );
          this.drawScaledLine(
            compassCoords[polyCompassCorners[2]],
            compassCoords[polyCompassCorners[3]]
          );
        }
      }
    }
  };

  drawSmoothContours()
  {
    this._ctx.strokeStyle = "red";
    for (var i = 0; i < this._cellTypes.length; i++)
    {
      for (var j = 0; j < this._cellTypes[i].length; j++)
      {
        var cellType = this._cellTypes[i][j];
        var polyCompassCorners = cellTypeToPolyCorners[cellType];

        // The samples at the 4 corners of the current cell
        var NW = this._samples[i][j];
        var NE = this._samples[i][j + 1];
        var SW = this._samples[i + 1][j];
        var SE = this._samples[i + 1][j + 1];

        // The offset from top or left that the line intersection should be.
        var N = (cellType & 4) === (cellType & 8) ? 0.5 : lerp(NW, NE, 0, 1, this._threshold);
        var E = (cellType & 2) === (cellType & 4) ? 0.5 : lerp(NE, SE, 0, 1, this._threshold);
        var S = (cellType & 1) === (cellType & 2) ? 0.5 : lerp(SW, SE, 0, 1, this._threshold);
        var W = (cellType & 1) === (cellType & 8) ? 0.5 : lerp(NW, SW, 0, 1, this._threshold);

        var compassCoords = {
          "N": [i, j + N],
          "W": [i + W, j],
          "E": [i + E, j + 1],
          "S": [i + 1, j + S],
        };

        if (polyCompassCorners.length === 2)
        {
          this.drawScaledLine(
            compassCoords[polyCompassCorners[0]],
            compassCoords[polyCompassCorners[1]]
          );
        } else if (polyCompassCorners.length === 4)
        {
          this.drawScaledLine(
            compassCoords[polyCompassCorners[0]],
            compassCoords[polyCompassCorners[1]]
          );
          this.drawScaledLine(
            compassCoords[polyCompassCorners[2]],
            compassCoords[polyCompassCorners[3]]
          );
        }

      }
    }
  }
}
