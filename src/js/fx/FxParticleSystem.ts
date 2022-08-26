import { FxConstraint, FxConstraints } from './FxConstraints';
import { FxCollisionForce, FxForce, FxForces } from './FxForces';
import { FxParticle, FX_ITERATIONS, FX_PARTICLE_RADIUS, FX_VEL_DAMPING, FX_TIMESTEP_SQR, FxParticles } from './FxParticle';
import { vec2, VEC2_ZERO } from './vec2';

export class FxParticleSystem
{
    // private updateObserver: Observer<any>;

    private p0: FxParticles;
    private p1: FxParticles;
    private p2: FxParticles;
    private a: FxParticles;
    private v: FxParticles;
    private r: Array<number>; // radius
    private d: Array<number>; // damping

    private cp: FxConstraints;
    private ct: FxConstraints;
    private fp: FxForces;
    private ft: FxForces;

    constructor()
    {}

    setUp()
    {
        this.p0 = [];
        this.p1 = [];
        this.p2 = [];
        this.a = [];
        this.v = [];
        
        this.r = [];
        this.d = [];

        this.cp = [];
        this.ct = [];

        this.fp = [];
        this.ft = [];

    }

    tearDown()
    {
        this.p0.length = 0;
        this.p1.length = 0;
        this.p2.length = 0;
        this.a.length = 0;
        this.v.length = 0;
        
        this.r.length = 0;
        this.d.length = 0;

        this.cp.length = 0;
        this.ct.length = 0;

        this.fp.length = 0;
        this.ft.length = 0;
    }

    // private clean()
    // {
    //     this.v.forEach( vi => vi.assign( 0, 0,  ) );
    //     this.a.forEach( ai => ai.assign( 0, 0, ) );
    // }

    update()
    {
        this.v.forEach( vi => vi.zero() );

        for (let j=0; j<FX_ITERATIONS; ++j)
        {
            this.n2Collision();

            this.a.forEach( ai => ai.zero() );

            this.accumulateForces( this.fp );
            this.accumulateForces( this.ft );
    
            this.verletInt();
    
            this.satisfyConstraints( this.ct );
            this.satisfyConstraints( this.cp );

            this.ft.length = 0;
            this.ct.length = 0;
        }
        
    }


    private n2Collision()
    {
        const p_count = this.count();
    
        for ( let u=0, l=p_count-1; u<l; ++u )
            for ( let v=u+1; v<p_count; ++v )
            {
                const p_u = this.p1[u];
                const p_v = this.p1[v];
                
                const delta = p_u.sub( p_v );
                const delta_length = delta.mag();
                
                const LINK_DISTANCE = this.r[u] + this.r[v];
                
                if (delta_length<LINK_DISTANCE)
                {
                    this.addTmpForce( FxCollisionForce( u, v, LINK_DISTANCE ) );
                }
                
            }
    
    }

    private verletInt()
    {
        const l = this.p0.length;

        for( let i=0; i<l; i++ )
        {
            const p2_i = this.p2[i];
            const p1_i = this.p1[i];
            const p0_i = this.p0[i];
            const a_i = this.a[i];
            const v_i = this.v[i];
            const D = this.d[i]; // damping
            
            if (p2_i===null)
                continue;

            v_i.copyFrom( a_i.scale( FX_TIMESTEP_SQR ) );
            v_i.addInPlace( p1_i.sub(p0_i).scaleInPlace(D) );
            const pos_i = p1_i.add( v_i );
            p2_i.copyFrom( pos_i );
        }
        
        // swap
        [ this.p0, this.p1, this.p2 ] = [ this.p1, this.p2, this.p0 ];
    }
    
    private accumulateForces( f: FxForces )
    {
        f.forEach( fi => fi.apply( this.p1, this.p0, this.a ) );
    }

    private satisfyConstraints( c: FxConstraints )
    {
        const NUM_ITERATIONS = 4;

        for ( let j=0; j<NUM_ITERATIONS; j++)
        {
            c.forEach( ci => ci.apply( this.p1 ) );
        }
    }

    addParticle( pos: vec2, r = FX_PARTICLE_RADIUS, d=FX_VEL_DAMPING ): FxParticle
    {
        const pi = this.p0.length;

        this.p0.push( pos.clone() );
        this.p1.push( pos.clone() );
        this.p2.push( pos.clone() );

        this.v.push( VEC2_ZERO() );
        this.a.push( VEC2_ZERO() );

        this.r.push( r );
        this.d.push( d );

        return pi;
    }

    removeParticle( p: FxParticle )
    {
        this.fp = this.fp.filter( fi => !fi.has(p) );
        this.cp = this.cp.filter( ci => !ci.has(p) );

        if ( p === this.p1.length-1 )
            this.removeTailParticles( p );
        else
            this.deleteParticle( p );
    }

    private removeTailParticles( p: number, n: number = 1 )
    {
        this.p0.splice(p, n );
        this.p1.splice(p, n );
        this.p2.splice(p, n );

        this.a.splice(p, n );
        this.v.splice(p, n );
        this.v.splice(p, n );

        this.r.splice(p, n );
    }

    private deleteParticle( p: number, )
    {
        this.p0[p] = null;
        this.p1[p] = null;
        this.p2[p] = null;

        this.a[p] = null;
        this.v[p] = null;

        this.r[p] = null;
    }

    addConstraint( constraint: FxConstraint, )
    {
        this.cp.push( constraint );
    }

    removeConstraint( c: FxConstraint, )
    {
        this.cp.splice( this.cp.findIndex( ce => ce === c ), 1 );
    }

    addTmpConstraint( constraint: FxConstraint )
    {
        this.ct.push( constraint );
    }

    addForce( f: FxForce )
    {
        this.fp.push( f );
    }

    removeForce( f: FxForce, )
    {
        this.fp.splice( this.fp.findIndex( fe => fe === f ), 1 );
    }
    
    addTmpForce( f: FxForce)
    {
        this.ft.push( f );
    }
    
    getPos( p: FxParticle )
    {
        return this.p1[p];
    }

    count(): number
    {
        return this.p1.length;
    }

    getRadius( p: FxParticle ): number
    {
        return this.r[p];
    }

    // removeRange( r: FxRange )
    // {
    //     const l = r[1] - r[0] +1;

    //     this.removeParticle( r[0], l );
    // }

}
