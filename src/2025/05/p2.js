import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const ranges = data
  .split('\n\n')[0]
  .split('\n')
  .map((range) => range.split('-').map(Number));

function main() {
  let count = 0;
  let foundOverlap = false;

  do {
    foundOverlap = false;

    for (let i = 0; i < ranges.length; i++) {
      let range1 = ranges[i];

      for (let j = i + 1; j < ranges.length; j++) {
        const range2 = ranges[j];

        if (range1[0] > range2[1] || range2[0] > range1[1]) continue;

        ranges[i] = [
          Math.min(range1[0], range2[0]),
          Math.max(range1[1], range2[1]),
        ];
        range1 = ranges[i];
        ranges.splice(j--, 1);
        foundOverlap = true;
      }
    }
  } while (foundOverlap);

  for (const range of ranges) {
    count += range[1] - range[0] + 1;
  }

  return count;
}

console.log(measureExecutionTime(main));
