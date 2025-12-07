import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const grid = data.split('\n');

function main() {
  let totalSplit = 0;
  let currentCols = new Set([grid[0].indexOf('S')]);

  for (let row = 1; row < grid.length - 1; row++) {
    const nextCols = new Set();

    for (const col of currentCols) {
      if (grid[row + 1][col] !== '^') {
        nextCols.add(col);
        continue;
      }

      nextCols.add(col - 1);
      nextCols.add(col + 1);
      totalSplit += 1;
    }

    currentCols = nextCols;
  }

  return totalSplit;
}

console.log(measureExecutionTime(main));
