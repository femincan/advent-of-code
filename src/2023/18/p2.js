console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');
const instructions = data.map((line) => {
  const [lineMatch] = line.match(/\w{6}/);
  return ['RDLU'[lineMatch.at(-1)], parseInt(lineMatch.slice(0, 5), 16)];
});

const vertices = [[0, 0]];
for (let i = 0; i < instructions.length; i++) {
  const [direction, amount] = instructions[i];
  const lastVertice = vertices.at(-1);

  switch (direction) {
    case 'R':
      vertices.push([lastVertice[0] + amount, lastVertice[1]]);
      break;
    case 'L':
      vertices.push([lastVertice[0] - amount, lastVertice[1]]);
      break;
    case 'U':
      vertices.push([lastVertice[0], lastVertice[1] + amount]);
      break;
    case 'D':
      vertices.push([lastVertice[0], lastVertice[1] - amount]);
      break;
  }
}

vertices.pop();

const pointsCount =
  getPolygonArea(vertices) + getVerticesCount(vertices) / 2 + 1;

console.log(pointsCount);

function getVerticesCount(vertices) {
  let count = 0;

  for (let i = 0; i < vertices.length; i++) {
    const vertice1 = vertices[i];
    const vertice2 = i === vertices.length - 1 ? vertices[0] : vertices[i + 1];

    const xRange = Math.abs(vertice1[0] - vertice2[0]);

    if (xRange > 0) {
      count += xRange;
      continue;
    }

    const yRange = Math.abs(vertice1[1] - vertice2[1]);

    if (yRange > 0) {
      count += yRange;
    }
  }

  return count;
}

function getPolygonArea(vertices) {
  let sum1 = 0n,
    sum2 = 0n;

  for (let i = 0; i < vertices.length; i++) {
    const vertice1 = vertices[i];
    const vertice2 = i === vertices.length - 1 ? vertices[0] : vertices[i + 1];

    sum1 += BigInt(vertice1[0]) * BigInt(vertice2[1]);
    sum2 += BigInt(vertice1[1]) * BigInt(vertice2[0]);
  }

  return Math.abs(Number(sum1 - sum2)) / 2;
}

console.timeEnd('Execution Time');
