console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const pipeMap = {
  '-': { west: [0, 1], east: [0, -1] },
  '|': { north: [1, 0], south: [-1, 0] },
  F: { east: [1, 0], south: [0, 1] },
  L: { east: [-1, 0], north: [0, 1] },
  J: { north: [0, -1], west: [-1, 0] },
  7: { west: [1, 0], south: [0, -1] },
};
const lineIndexOfS = data.findIndex((line) => line.includes('S'));
const indexOfS = data[lineIndexOfS].indexOf('S');

let currentPipes = checkAround([lineIndexOfS, indexOfS]);
const vertices = [];

let count = 1;
mainLoop: while (true) {
  count += 1;

  const newPipes = [];

  for (let index = 0; index < currentPipes.length; index++) {
    const { pipe, entrance, coordinates } = currentPipes[index];

    const coordDiff = pipeMap[pipe][entrance];
    const targetCoord = coordinates
      .at(-1)
      .map((coord, i) => coord + coordDiff[i]);
    const targetPipe = data[targetCoord[0]]?.[targetCoord[1]];

    if (targetPipe) {
      const currentExit = Object.keys(pipeMap[pipe]).find(
        (key) => key !== entrance
      );

      const targetEntrance = findTargetEntrance(currentExit);
      const matchedPipe = newPipes.find(({ coordinates }) =>
        coordinates.at(-1).every((coord, i) => coord === targetCoord[i])
      );

      if (matchedPipe) {
        vertices.push(
          [lineIndexOfS, indexOfS],
          ...coordinates,
          ...matchedPipe.coordinates.toReversed()
        );
        break mainLoop;
      } else {
        newPipes.push({
          pipe: targetPipe,
          entrance: targetEntrance,
          coordinates: coordinates.toSpliced(
            coordinates.length,
            0,
            targetCoord
          ),
        });
      }
    }
  }

  currentPipes = newPipes;
}

console.log(getPolygonArea(vertices) - vertices.length / 2 + 1);

function getPolygonArea(vertices) {
  let sum1 = 0,
    sum2 = 0;

  vertices.reduce((vertice1, vertice2) => {
    sum1 += vertice1[1] * vertice2[0];
    sum2 += vertice1[0] * vertice2[1];

    return vertice2;
  });

  sum1 += vertices.at(-1)[1] * vertices[0][0];
  sum2 += vertices.at(-1)[0] * vertices[0][1];

  return Math.abs(sum1 - sum2) / 2;
}

function checkAround(sCoordinate) {
  const pipesAroundCoords = [];

  if (sCoordinate[1] !== 0) {
    const westPipe = data[sCoordinate[0]][sCoordinate[1] - 1];

    if (
      pipeMap.hasOwnProperty(westPipe) &&
      pipeMap[westPipe].hasOwnProperty('east')
    ) {
      const pipeCoordinate = [sCoordinate[0], sCoordinate[1] - 1];

      pipesAroundCoords.push({
        pipe: data[pipeCoordinate[0]][pipeCoordinate[1]],
        entrance: 'east',
        coordinates: [pipeCoordinate],
      });
    }
  }

  if (sCoordinate[1] !== data[sCoordinate[0]].length - 1) {
    const eastPipe = data[sCoordinate[0]][sCoordinate[1] + 1];

    if (
      pipeMap.hasOwnProperty(eastPipe) &&
      pipeMap[eastPipe].hasOwnProperty('west')
    ) {
      const pipeCoordinate = [sCoordinate[0], sCoordinate[1] + 1];

      pipesAroundCoords.push({
        pipe: data[pipeCoordinate[0]][pipeCoordinate[1]],
        entrance: 'west',
        coordinates: [pipeCoordinate],
      });
    }
  }

  if (sCoordinate[0] !== 0) {
    const northPipe = data[sCoordinate[0] - 1][sCoordinate[1]];

    if (
      pipeMap.hasOwnProperty(northPipe) &&
      pipeMap[northPipe].hasOwnProperty('south')
    ) {
      const pipeCoordinate = [sCoordinate[0] - 1, sCoordinate[1]];

      pipesAroundCoords.push({
        pipe: data[pipeCoordinate[0]][pipeCoordinate[1]],
        entrance: 'south',
        coordinates: [pipeCoordinate],
      });
    }
  }

  if (sCoordinate[0] !== data.length - 1) {
    const southPipe = data[sCoordinate[0] + 1][sCoordinate[1]];

    if (
      pipeMap.hasOwnProperty(southPipe) &&
      pipeMap[southPipe].hasOwnProperty('north')
    ) {
      const pipeCoordinate = [sCoordinate[0] + 1, sCoordinate[1]];

      pipesAroundCoords.push({
        pipe: data[pipeCoordinate[0]][pipeCoordinate[1]],
        entrance: 'north',
        coordinates: [pipeCoordinate],
      });
    }
  }

  return pipesAroundCoords;
}

function findTargetEntrance(currentExit) {
  switch (currentExit) {
    case 'west':
      return 'east';
    case 'east':
      return 'west';
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    default:
      throw new Error('Unknown direction!');
  }
}

console.timeEnd('Execution Time');
