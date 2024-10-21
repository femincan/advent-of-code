console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const expansionAmount = 1_000_000;

const empities = {
  rows: [],
  cols: Array.from(Array(data[0].length), (_, i) => i),
};
const galaxyCoords = [];

data.forEach((row, rowIndex) => {
  const galaxies = Array.from(row.matchAll(/#/g));

  if (galaxies.length) {
    galaxies.forEach(({ index: colIndex }) => {
      galaxyCoords.push([rowIndex, colIndex]);

      empities.cols = empities.cols.filter(
        (emptyColIndex) => emptyColIndex !== colIndex
      );
    });
  } else {
    empities.rows.push(rowIndex);
  }
});

let shortestPathsSum = 0;
for (let i = 0; i < galaxyCoords.length - 1; i++) {
  const galaxyCoord1 = galaxyCoords[i];

  for (let j = i + 1; j < galaxyCoords.length; j++) {
    const galaxyCoord2 = galaxyCoords[j];

    const rowRange = Math.abs(galaxyCoord1[0] - galaxyCoord2[0]);
    const colRange = Math.abs(galaxyCoord1[1] - galaxyCoord2[1]);

    const expandedRowRanges = empities.rows.filter(
      (emptyRowIndex) =>
        emptyRowIndex > Math.min(galaxyCoord1[0], galaxyCoord2[0]) &&
        emptyRowIndex < Math.max(galaxyCoord1[0], galaxyCoord2[0])
    ).length;
    const expandedColRanges = empities.cols.filter(
      (emptyColIndex) =>
        emptyColIndex > Math.min(galaxyCoord1[1], galaxyCoord2[1]) &&
        emptyColIndex < Math.max(galaxyCoord1[1], galaxyCoord2[1])
    ).length;

    shortestPathsSum +=
      rowRange +
      colRange +
      expandedRowRanges * expansionAmount -
      expandedRowRanges +
      expandedColRanges * expansionAmount -
      expandedColRanges;
  }
}

console.log(shortestPathsSum);

console.timeEnd('Execution Time');
