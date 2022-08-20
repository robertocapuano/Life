/**
 * Convert a grid of continuous values to a
 * grid of booleans.
 */
 export function threshold(grid: number[][], value: number): boolean[][]
 {
    const ret = new Array<boolean[]>();

    for (var i = 0; i < grid.length; i++) {
      ret.push([]);
      for (var j = 0; j < grid[i].length; j++) {
        ret[i].push(grid[i][j] > value);
      }
    }
  
    return ret;
}
