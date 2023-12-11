export const genRandNumber = (min: number, max: number) => {
  let difference = max - min + 1;

  let rand = Math.random();

  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
};

export const genRandEvenNumber = (min: number, max: number) => {
  min = Math.floor(min);
  max = Math.floor(max);
  let rand = genRandNumber(min, max);
  if (rand % 2 != 0) {
    rand = rand + 1 > max ? rand - 1 : rand + 1;
  }
  return rand;
};

export const genRandOddNumber = (min: number, max: number) => {
  min = Math.floor(min);
  max = Math.floor(max);
  let rand = genRandNumber(min, max);
  if (rand % 2 == 0) {
    rand = rand + 1 > max ? rand - 1 : rand + 1;
  }
  return rand;
};
