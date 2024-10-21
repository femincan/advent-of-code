console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim();
const threadsCount = 16;

const mapsRegex = /\n\n[\w-]+ map:\n/g;
const [seedRangesLine, ...maps] = data.split(mapsRegex);
const seedRangesMatch = seedRangesLine.match(/\d+/g);

const seedRanges = [];
for (let i = 0; i < seedRangesMatch.length; i += 2) {
  seedRanges.push([Number(seedRangesMatch[i]), Number(seedRangesMatch[i + 1])]);
}

while (seedRanges.length < threadsCount) {
  seedRanges.sort((a, b) => b[1] - a[1]);

  const largestRange = seedRanges[0];

  const firstStartSeed = largestRange[0];
  const firstRangeLength =
    largestRange[1] % 2 === 0
      ? largestRange[1] / 2
      : Math.floor(largestRange[1] / 2) + 1;
  const secondStartSeed = firstStartSeed + firstRangeLength;
  const secondRangeLength = largestRange[1] - firstRangeLength;

  seedRanges[0] = [firstStartSeed, firstRangeLength];

  seedRanges.push([secondStartSeed, secondRangeLength]);
}

const parsedMaps = maps.map((map) => {
  const mapLines = map.split('\n');

  return mapLines.map((mapLine) =>
    mapLine.match(/\d+/g).map((rangeNumber) => Number(rangeNumber))
  );
});

const createWorker = (seedRange) =>
  new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, 'worker.js'), {
      workerData: { seedRange, parsedMaps },
    });

    worker.on('message', (data) => {
      resolve(data);
    });

    worker.on('error', ({ message }) => {
      reject(message);
    });
  });

const workerPromises = [];
seedRanges.forEach((seedRange) => {
  workerPromises.push(createWorker(seedRange));
});

const threadResults = await Promise.all(workerPromises);

console.log(
  threadResults.reduce(
    (lowestValue, currentValue) =>
      currentValue < lowestValue ? currentValue : lowestValue,
    Number.MAX_SAFE_INTEGER
  )
);

console.timeEnd('Execution Time');
