console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim();
const allValues = data.match(/\d+/g);

const timeDistancePairs = [];
for (let i = 0; i < allValues.length / 2; i++) {
  timeDistancePairs.push([
    Number(allValues[i]),
    Number(allValues[i + allValues.length / 2]),
  ]);
}

const multiplicationOfBeats = timeDistancePairs.reduce(
  (multiplicationOfBeats, [time, distance]) => {
    for (let holdingTime = 1; holdingTime < time; holdingTime++) {
      const currentDistance = holdingTime * (time - holdingTime);

      if (currentDistance > distance) {
        const numberOfBeats = time - 2 * holdingTime + 1;

        return multiplicationOfBeats * numberOfBeats;
      }
    }
  },
  1
);

console.log(multiplicationOfBeats);

console.timeEnd('Execution Time');
