import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);
const lines = data.split('\n');

const presentAreas = [];

function main() {
  let fitted = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.endsWith(':')) {
      const present = lines.slice(i + 1, i + 4);

      let area = 0;
      for (const row of present) {
        for (const cell of row) {
          if (cell === '#') {
            area += 1;
          }
        }
      }

      presentAreas.push(area);
      i += 5;
      continue;
    }

    const [, regionSizeStr, presentCountsStr] = line.match(/^(\w+):\s(.+)$/);

    const regionArea = regionSizeStr
      .split('x')
      .reduce((area, valStr) => Number(valStr) * area, 1);

    const totalPresentArea = presentCountsStr
      .split(' ')
      .reduce(
        (area, countStr, i) => area + Number(countStr) * presentAreas[i],
        0
      );

    if (totalPresentArea <= regionArea) {
      fitted += 1;
    }

    i += 1;
  }

  return fitted;
}

console.log(measureExecutionTime(main));
