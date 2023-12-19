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

let nodes = Object.keys(originTargetMap).filter(
  (origin) => origin.at(-1) === 'A'
);
let step = 0;
for (; true; step++) {
  const direction = directions[step % directions.length];

  nodes = nodes.map((node) => {
    if (typeof node === 'number') {
      return node;
    }

    const target = originTargetMap[node][direction];

    if (target.at(-1) === 'Z') {
      return step + 1;
    }

    return target;
  });

  if (nodes.every((node) => typeof node === 'number')) break;
}

let currentLcm;
for (let i = 0; i < nodes.length; i++) {
  const node = nodes[i];

  if (!currentLcm) {
    i++;
    const node2 = nodes[i];
    currentLcm = lcm(node, node2);
  } else {
    currentLcm = lcm(node, currentLcm);
  }
}

console.log(currentLcm);

function lcm(num1, num2) {
  const min = Math.min(num1, num2);
  const max = Math.max(num1, num2);

  return (max / gcd(num1, num2)) * min;
}

function gcd(num1, num2) {
  let min = Math.min(num1, num2);
  let max = Math.max(num1, num2);

  if (max % min === 0) {
    return min;
  }

  while (min !== max) {
    const num = max - min;
    max = Math.max(num, min);
    min = max === num ? min : num;
  }

  return min;
}

console.timeEnd('Execution Time');
