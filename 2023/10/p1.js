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

let count = 1;
mainLoop: while (true) {
  count += 1;

  const newPipes = [];

  for (let index = 0; index < currentPipes.length; index++) {
    const { pipe, entrance, coordinate } = currentPipes[index];

    const coordDiff = pipeMap[pipe][entrance];
    const targetCoord = coordinate.map((coord, i) => coord + coordDiff[i]);
    const targetPipe = data[targetCoord[0]]?.[targetCoord[1]];

    if (targetPipe) {
      const currentExit = Object.keys(pipeMap[pipe]).find(
        (key) => key !== entrance
      );

      const targetEntrance = findTargetEntrance(currentExit);

      if (
        newPipes.some(({ coordinate }) =>
          coordinate.every((coord, i) => coord === targetCoord[i])
        )
      ) {
        break mainLoop;
      } else {
        newPipes.push({
          pipe: targetPipe,
          entrance: targetEntrance,
          coordinate: targetCoord,
        });
      }
    }
  }

  currentPipes = newPipes;
}

console.log(count);

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
        coordinate: pipeCoordinate,
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
        coordinate: pipeCoordinate,
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
        coordinate: pipeCoordinate,
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
        coordinate: pipeCoordinate,
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
