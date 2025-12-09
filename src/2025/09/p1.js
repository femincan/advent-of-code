import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);
const coordinates = data.split('\n').map((line) => line.split(',').map(Number));

function main() {
  let largestArea = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const [x1, y1] = coordinates[i];
    for (let j = i + 1; j < coordinates.length; j++) {
      const [x2, y2] = coordinates[j];
      const area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);

      if (area < largestArea) continue;

      largestArea = area;
    }
  }

  return largestArea;
}

console.log(measureExecutionTime(main));
