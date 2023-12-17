console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim();
const allValues = data.match(/\d+/g);

const [time, distance] = allValues.reduce((timeDistancePair, value, index) => {
  if (index < allValues.length / 2) {
    if (timeDistancePair[0]) {
      timeDistancePair[0] = Number(timeDistancePair[0].toString() + value);
    } else {
      timeDistancePair[0] = Number(value);
    }

    return timeDistancePair;
  }

  if (timeDistancePair[1]) {
    timeDistancePair[1] = Number(timeDistancePair[1].toString() + value);
  } else {
    timeDistancePair[1] = Number(value);
  }

  return timeDistancePair;
}, []);

let numberOfBeats;
for (let holdingTime = 1; holdingTime < time; holdingTime++) {
  const currentDistance = holdingTime * (time - holdingTime);

  if (currentDistance > distance) {
    numberOfBeats = time - 2 * holdingTime + 1;
    break;
  }
}

console.log(numberOfBeats);

console.timeEnd('Execution Time');
