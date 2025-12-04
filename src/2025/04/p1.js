import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);
const lines = data.split('\n');
// prettier-ignore
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function main() {
  let total = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '.') continue;

      const adjacentCount = directions.reduce(
        (count, [row, col]) =>
          count + (lines[i + row]?.[j + col] === '@' ? 1 : 0),
        0
      );

      if (adjacentCount < 4) {
        total += 1;
      }
    }
  }

  return total;
}

console.log(measureExecutionTime(main));
