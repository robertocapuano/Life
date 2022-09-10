import { VEC2, vec2 } from "./fx/vec2";
import { abs } from "./math";

class Bucket
{
    indexes: Array<number>;

    constructor() {
        this.indexes = [];
    }

    add( index: number )    { this.indexes.push( index ); }
    size()                  { return this.indexes.length; }
    clear()                 {  this.indexes.length = 0; }
}

export class Grid
{
    private buckets = new Array<Bucket>();

    constructor( 
        private n: number,
        private cell_size: number,
        private isNear: boolean,
     ) {

        for (let i=0; i<n; ++i )
        {
            this.buckets.push( new Bucket() );
        }

     }
    
    add( idx: number, pos: vec2, radius: number )
    {
        const indexes = this.adjacentCells( pos, radius );
        
        for ( const j of indexes )
        {
            this.buckets[j].add( idx );
        }
    }
    
    getBucket( pos: vec2 ): Bucket
    {
        const idx = this.posToIndex( pos );

        return this.buckets[idx];
    }

    clear()
    {
        this.buckets.forEach( b => {
            b.clear();
        });
    }

    private posToIndex( pos: vec2 ): number
    {
        const i = Math.trunc( pos.x / this.cell_size );
        const j = Math.trunc( pos.y / this.cell_size );
            
        const pi = 73856093;
        const pj = 19349663;
        
        const idx = abs(( i * pi) ^ (j * pj)) % this.n;
        
        return idx;
    }
    
    private adjacentCells( pos: vec2, radius: number ): Set<number> 
    {
        const indexes = new Set<number>()

        indexes.add( this.posToIndex(pos) );
        
        if (this.isNear)
        {
            indexes.add( this.posToIndex( pos.add( VEC2( +radius, +radius ) ) ) );
            indexes.add(  this.posToIndex( pos.add( VEC2( -radius, -radius ) ) ) );
            // indexes.add( this.posToIndex( pos.add( VEC2( +radius, -radius ) )) );
        }

        return indexes;
    }

}