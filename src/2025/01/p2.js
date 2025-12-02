import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const instructions = data
  .split('\n')
  .map((line) => ({ rotation: line[0], distance: Number(line.slice(1)) }));

function main() {
  const dialLimit = 100;
  let dialPointsZeroCount = 0;

  let dialPosition = 50;
  for (const instruction of instructions) {
    for (let _ = 1; _ <= instruction.distance; _++) {
      const newPosition =
        instruction.rotation === 'L' ? dialPosition - 1 : dialPosition + 1;

      dialPosition = ((newPosition % dialLimit) + dialLimit) % dialLimit;
      if (dialPosition === 0) {
        dialPointsZeroCount += 1;
      }
    }
  }

  return dialPointsZeroCount;
}

console.log(measureExecutionTime(main));
