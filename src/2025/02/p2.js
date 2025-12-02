import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const ranges = data.split(',').map((rangeStr) => rangeStr.split('-'));

function main() {
  let invalidSum = 0;

  for (const range of ranges) {
    const rangeStart = Number(range[0]);
    const rangeEnd = Number(range[1]);
    for (let id = rangeStart; id <= rangeEnd; id++) {
      const idStr = id.toString();

      outer: for (let i = 1; i < idStr.length; i++) {
        const pattern = idStr.slice(0, i);

        for (let j = i; j < idStr.length; j += pattern.length) {
          const nextPattern = idStr.slice(j, j + pattern.length);

          if (pattern !== nextPattern) {
            continue outer;
          }
        }

        invalidSum += id;
        break;
      }
    }
  }

  return invalidSum;
}

console.log(measureExecutionTime(main));
