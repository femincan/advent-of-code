import { parentPort, workerData } from 'node:worker_threads';

const { seedRange, parsedMaps } = workerData;

let lowestDestination = Number.MAX_SAFE_INTEGER;
for (let i = 0; i < seedRange[1]; i++) {
  let seed = seedRange[0] + i;

  parsedMaps.forEach((rangeMaps) => {
    for (let k = 0; k < rangeMaps.length; k++) {
      const rangeMap = rangeMaps[k];

      if (seed >= rangeMap[1] && seed < rangeMap[1] + rangeMap[2]) {
        seed = rangeMap[0] - rangeMap[1] + seed;
        break;
      }
    }
  });

  if (seed < lowestDestination) {
    lowestDestination = seed;
  }
}

parentPort.postMessage(lowestDestination);
