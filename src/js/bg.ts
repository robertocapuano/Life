import { TTWORLD } from "./WorldRefs";

export function drawBg(  )
{
  const { canvas } = TTWORLD;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  {
    const gradient = ctx.createLinearGradient(0,H, W,0);
    gradient.addColorStop(0, '#9437ff');
    gradient.addColorStop(.75, '#942193');
    // gradient.addColorStop(1, '#0096ff');
    gradient.addColorStop(1, '#ffffff');
    // ctx.fillStyle = gradient;
    ctx.fillStyle = '#942193';

    // this._ctx.fillStyle = SHADOW_CLR;
    ctx.fillRect(0, 0, W, H );
  }

  if (false)
  {

    const gradient = ctx.createRadialGradient( 0, H, 50, 550, 50, 75);

    // const gradient = ctx.createLinearGradient(W,0, 100,100);
    gradient.addColorStop(0, 'red' );//'#ebebeb');
    gradient.addColorStop(1, 'blue');//'#fff');
    // gradient.addColorStop(1, '#ebebeb');
    ctx.fillStyle = gradient;

    // this._ctx.fillStyle = LIGHT_CLR;
    // ctx.beginPath();
    // ctx.moveTo( 0, 0 );
    // ctx.lineTo( this._canvas.width, 200);
    // ctx.lineTo(this._canvas.width, 0);
    // ctx.fill();

    ctx.fillRect( 0, 0, W, H );
  }

};