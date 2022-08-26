
export const RND01 = Math.random;
export const RND0N = getRandomInt;
// export const RNDYN = randomCoin;

export function RND11()
{
    return Math.random() *2 -1;
}

export function randomNumber(min: number, max: number) {
    if (min === max) {
        return (min);
    }
    var random = Math.random();
    return ((random * (max - min)) + min);
}

export function getRandomInt(max: number ) {
    return getRandomRange(0,max);
}

export function getRandomRange(min: number, max: number ) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  
