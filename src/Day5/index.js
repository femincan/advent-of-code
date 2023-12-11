import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = true;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim();

const mapsRegex = /\n\n[\w-]+ map:\n/g;
const [seedsLine, ...maps] = data.split(mapsRegex);
const seeds = seedsLine.match(/\d+/g).map((seed) => Number(seed));

const parsedMaps = maps.map((map) => {
  const mapLines = map.split('\n');

  return mapLines.map((mapLine) =>
    mapLine.match(/\d+/g).map((rangeNumber) => Number(rangeNumber))
  );
});

const lowestDestinationNumber = seeds.reduce(
  (lowestDestinationNumber, seed) => {
    let destinationNumber = seed;

    parsedMaps.forEach((parsedMap) => {
      for (let i = 0; i < parsedMap.length; i++) {
        const rangeMap = parsedMap[i];

        if (
          destinationNumber >= rangeMap[1] &&
          destinationNumber <= rangeMap[1] + rangeMap[2]
        ) {
          destinationNumber = rangeMap[0] + destinationNumber - rangeMap[1];
          break;
        }
      }
    });

    return destinationNumber < lowestDestinationNumber
      ? destinationNumber
      : lowestDestinationNumber;
  },
  Infinity
);

console.log(lowestDestinationNumber);
