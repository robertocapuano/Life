import { Cellular } from "./cellular/cellular";
import { Flow } from "./flow/flow";
import { FxParticleSystem } from "./fx/FxParticleSystem";
import { MarchingSquare } from "./marching-square/marching-square";
import { UserSlash } from "./user-slash";

interface WorldRefs {
    sim: MarchingSquare;
    pSys: FxParticleSystem;
    flow: Flow;
    cellular: Cellular;
    slashUi: UserSlash;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
};

export let TTWORLD: WorldRefs = {
    sim: null,
    pSys: null,
    flow: null,
    cellular: null,
    slashUi: null,
    canvas: null,
    ctx: null,
};

