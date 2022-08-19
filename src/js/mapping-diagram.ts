// var cellTypeToPolyCorners = require("./cell-type-to-poly-corners.js");

import { cellTypeToPolyCorners } from "./cell-type-to-poly-corners";

const width = 700;
const height = 500;

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
if (!!ctx)
{

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    for (var i = 0; i < 16; i++) {
    const row = i % 8;
    const col = Math.floor(i / 8);

    ctx.save();
    ctx.translate(55 + col * (width / 2), 20 + row * ((height - 20) / 8));

    const cellSize = 40;

    const SW = (i >> 0) & 1;
    const SE = (i >> 1) & 1;
    const NE = (i >> 2) & 1;
    const NW = (i >> 3) & 1;

    const cornerOffsets = [
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0]
    ];

    var bitString = "";

    ctx.strokeStyle = '#888';
    ctx.strokeRect(0, 0, cellSize, cellSize);
    for (let bit = 0; bit < 4; bit++) {
        const bitVal = (i >> bit) & 1;
        if (bitVal) {
        ctx.fillStyle = '#0f0';
        } else {
        ctx.fillStyle = '#888';
        }
        bitString = bitVal + bitString;
        var offsets = cornerOffsets[bit];
        ctx.fillRect(
        offsets[0] * cellSize - 2,
        offsets[1] * cellSize - 2,
        4,
        4
        );
    }

    ctx.fillStyle = '#888';
    ctx.font = '16px monospace';

    ctx.translate(cellSize + 30, 0);
    ctx.fillText(
        bitString + " = " + i + ((i < 10) ? " " : ""),
        0,
        25
    );

    ctx.strokeStyle = '#888';
    ctx.translate(110, 0);
    ctx.strokeRect(0, 0, cellSize, cellSize);
    for (let bit = 0; bit < 4; bit++) {
        const bitVal = (i >> bit) & 1;
        if (bitVal) {
            ctx.fillStyle = '#0f0';
        } else {
         ctx.fillStyle = '#888';
        }
        bitString = bitVal + bitString;
        const offsets = cornerOffsets[bit];
        ctx.fillRect(
            offsets[0] * cellSize - 2,
            offsets[1] * cellSize - 2,
            4,
            4
        );
    }

    const polyCompassCorners = cellTypeToPolyCorners[i];

    var drawScaledLine = function(a, b) {
        var x0 = a[1] * cellSize;
        var y0 = a[0] * cellSize;
        var x1 = b[1] * cellSize;
        var y1 = b[0] * cellSize;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    };

    var compassCoords = {
        "N" : [0.0, 0.5],
        "W" : [0.5, 0.0],
        "E" : [0.5, 1.0],
        "S" : [1.0, 0.5],
    };

    ctx.strokeStyle = '#0f0';
    if (polyCompassCorners.length === 2) {
        drawScaledLine(
        compassCoords[polyCompassCorners[0]],
        compassCoords[polyCompassCorners[1]]
        );
    } else if (polyCompassCorners.length === 4) {
        drawScaledLine(
        compassCoords[polyCompassCorners[0]],
        compassCoords[polyCompassCorners[1]]
        );
        drawScaledLine(
        compassCoords[polyCompassCorners[2]],
        compassCoords[polyCompassCorners[3]]
        );
    }

    ctx.restore();
    }
}
