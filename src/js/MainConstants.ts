import { FPS } from "./fx/FxParticle";
import { RAD } from "./math";

export const WIDTH = 800;
export const HEIGHT = 600;

export const FORWARD_STEP = 60;
export const MAIN_RADIUS = 10;
export const INTRA_RADIUS = 5
export const AXIS_ANGLE = RAD(30);

export function SECS(x:number) { return x * FPS; };

export const VERSION = '1.0.0';

export const CIRCLE_CLR = 'white';
export const SHADOW_CLR = '#91866e';
export const LIGHT_CLR = 'white';
export const LIFE_CLR = 'white';
