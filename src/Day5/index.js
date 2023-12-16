console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim();

const mapsRegex = /\n\n[\w-]+ map:\n/g;
const [seedRangesLine, ...maps] = data.split(mapsRegex);
const seedRangesMatch = seedRangesLine.match(/\d+/g);

const seedRanges = [];
for (let i = 0; i < seedRangesMatch.length; i += 2) {
  const seed = Number(seedRangesMatch[i]);
  const rangeLength = Number(seedRangesMatch[i + 1]);
  seedRanges.push([seed, seed + rangeLength - 1]);
}

const rangeMaps = maps.map((map) => {
  const mapLines = map.split('\n');

  return mapLines.map((mapLine) => {
    const rangeNumbers = mapLine
      .match(/\d+/g)
      .map((rangeNumber) => Number(rangeNumber));

    return [
      rangeNumbers[1],
      rangeNumbers[1] + rangeNumbers[2] - 1,
      rangeNumbers[0] - rangeNumbers[1],
    ];
  });
});

const transformRange = (inputRange, processRange) => {
  if (inputRange[0] > processRange[1] || inputRange[1] < processRange[0]) {
    return null;
  }

  const result = [];

  const isStartLess = inputRange[0] < processRange[0];
  const isEndGreater = inputRange[1] > processRange[1];

  const startRange = isStartLess ? processRange[0] : inputRange[0];
  const endRange = isEndGreater ? processRange[1] : inputRange[1];

  result.push([startRange + processRange[2], endRange + processRange[2]]);

  const residuals = [];

  if (isStartLess) {
    residuals.push([inputRange[0], startRange - 1]);
  }

  if (isEndGreater) {
    residuals.push([endRange + 1, inputRange[1]]);
  }

  if (residuals.length) {
    result.push(residuals);
  }

  return result;
};

let transformedRanges = [];
rangeMaps.forEach((rangeMap) => {
  const inputRanges = transformedRanges.length
    ? [...transformedRanges]
    : [...seedRanges];
  transformedRanges = [];

  rangeMap.forEach((range) => {
    for (let i = 0; i < inputRanges.length; i++) {
      const inputRange = inputRanges[i];

      const result = transformRange(inputRange, range);

      if (result === null) continue;

      transformedRanges.push(result[0]);
      inputRanges.splice(i, 1);
      i--;

      if (result.length > 1) {
        inputRanges.push(...result[1]);
      }
    }
  });

  if (inputRanges.length) {
    transformedRanges.push(...inputRanges);
  }
});

console.log(
  transformedRanges.reduce(
    (lowestValue, range) => Math.min(lowestValue, range[0]),
    Number.MAX_SAFE_INTEGER
  )
);

console.timeEnd('Execution Time');
