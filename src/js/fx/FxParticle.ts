import { vec2 } from './vec2';

export const FPS = 60;
export const ONE_SEC = 60;

export type FxPos = vec2;
export type FxParticle = number;
export type FxParticles = Array<vec2>;
export type FxParticleCheck = (p: FxParticle) => boolean;

export const FX_ITERATIONS = 4;
export const FX_PARTICLE_RADIUS = 10;
export const FX_TIMESTEP = (1/ONE_SEC);
export const FX_TIMESTEP_SQR = FX_TIMESTEP * FX_TIMESTEP;
export const FX_VEL_DAMPING = 1 - 1e-4;// 1;//.999;//.995;

export const INV_FRAMETIME = FPS;
export const INV_FRAMETIME_SQR = INV_FRAMETIME * INV_FRAMETIME;
