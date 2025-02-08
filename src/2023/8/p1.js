console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const [firstLine] = data.splice(0, 2);

const directions = firstLine
  .split('')
  .map((direction) => (direction === 'R' ? 1 : 0));

const originTargetMap = {};
data.forEach((line) => {
  const [origin, ...targets] = line.match(/\w+/g);

  originTargetMap[origin] = targets;
});

let currentOrigin = 'AAA';
let step = 0;
for (; true; step++) {
  const direction = directions[step % directions.length];

  currentOrigin = originTargetMap[currentOrigin][direction];

  if (currentOrigin === 'ZZZ') break;
}

console.log(step + 1);

console.timeEnd('Execution Time');
