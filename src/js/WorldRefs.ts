import { Cellular } from "./cellular/cellular";
import { Flow } from "./flow/flow";
import { Gate } from "./flow/gate";
import { FxParticleSystem } from "./fx/FxParticleSystem";
import { MarchingSquare } from "./marching-square/marching-square";
import { UserSlash } from "./user-slash";

interface WorldRefs {
    sim: MarchingSquare;
    pSys: FxParticleSystem;
    flow: Flow;
    gate: Gate;
    cellular: Cellular;
    slashUi: UserSlash;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
};

export let TTWORLD: WorldRefs = {
    sim: null,
    pSys: null,
    flow: null,
    gate: null,
    cellular: null,
    slashUi: null,
    canvas: null,
    ctx: null,
};

