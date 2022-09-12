import { TTWORLD } from "./WorldRefs";

export function drawBg(  )
{
  const { canvas } = TTWORLD;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  {
  
    ctx.fillStyle = '#942193';

    // this._ctx.fillStyle = SHADOW_CLR;
    ctx.fillRect(0, 0, W, H );
  }

};