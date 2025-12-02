import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const ranges = data.split(',').map((rangeStr) => rangeStr.split('-'));

function main() {
  let invalidSum = 0;

  for (const range of ranges) {
    const rangeStart = Number(range[0]);
    const rangeEnd = Number(range[1]);

    for (let id = rangeStart; id <= rangeEnd; id++) {
      const idLength = (Math.log(id) * Math.LOG10E + 1) | 0;
      const idLengthPower = 10 ** (idLength / 2);

      if (
        idLength % 2 === 0 &&
        Math.floor(id / idLengthPower) === id % idLengthPower
      ) {
        invalidSum += id;
      }
    }
  }

  return invalidSum;
}

console.log(measureExecutionTime(main));
