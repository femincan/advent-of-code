import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');
const instructions = data.map((line) => {
  const lineMatch = line.match(/\w+(?=\s)/g);
  return [lineMatch[0], Number(lineMatch[1])];
});

const vertices = [[0, 0]];
instructions.forEach(([direction, amount]) => {
  switch (direction) {
    case 'R':
      vertices.push(
        ...Array.from(Array(amount), (_, i) => [
          vertices.at(-1)[0] + (i + 1),
          vertices.at(-1)[1],
        ])
      );
      break;
    case 'L':
      vertices.push(
        ...Array.from(Array(amount), (_, i) => [
          vertices.at(-1)[0] - (i + 1),
          vertices.at(-1)[1],
        ])
      );
      break;
    case 'U':
      vertices.push(
        ...Array.from(Array(amount), (_, i) => [
          vertices.at(-1)[0],
          vertices.at(-1)[1] + (i + 1),
        ])
      );
      break;
    case 'D':
      vertices.push(
        ...Array.from(Array(amount), (_, i) => [
          vertices.at(-1)[0],
          vertices.at(-1)[1] - (i + 1),
        ])
      );
      break;
  }
});

vertices.pop();

const pointsCount =
  getPolygonArea(vertices) - vertices.length / 2 + 1 + vertices.length;
console.log(pointsCount);

function getPolygonArea(vertices) {
  let sum1 = 0,
    sum2 = 0;

  vertices.reduce((vertice1, vertice2) => {
    sum1 += vertice1[0] * vertice2[1];
    sum2 += vertice1[1] * vertice2[0];

    return vertice2;
  });

  sum1 += vertices.at(-1)[0] * vertices[0][1];
  sum2 += vertices.at(-1)[1] * vertices[0][0];

  return Math.abs(sum1 - sum2) / 2;
}
