import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const asterisksData = data.reduce((asterisksData, line, lineIndex) => {
  const numbersMatch = line.matchAll(/\d+/g);

  for (const numberMatch of numbersMatch) {
    const asteriskLocs = [];

    const lookStartIndex = numberMatch.index - 1;
    const lookEndIndex = numberMatch.index + numberMatch[0].length;

    const previousCharacter = line[lookStartIndex];
    const nextCharacter = line[lookEndIndex];
    const previousLine = data[lineIndex - 1];
    const nextLine = data[lineIndex + 1];

    if (previousCharacter && previousCharacter === '*') {
      asteriskLocs.push(`${lookStartIndex}_${lineIndex}`);
    }

    if (nextCharacter && nextCharacter === '*') {
      asteriskLocs.push(`${lookEndIndex}_${lineIndex}`);
    }

    if (previousLine) {
      const asterisksMatch = previousLine.matchAll(/\*/g);

      for (const asteriskMatch of asterisksMatch) {
        if (
          asteriskMatch.index <= lookEndIndex &&
          asteriskMatch.index >= lookStartIndex
        ) {
          asteriskLocs.push(`${asteriskMatch.index}_${lineIndex - 1}`);
        }
      }
    }

    if (nextLine) {
      const asterisksMatch = nextLine.matchAll(/\*/g);

      for (const asteriskMatch of asterisksMatch) {
        if (
          asteriskMatch.index <= lookEndIndex &&
          asteriskMatch.index >= lookStartIndex
        ) {
          asteriskLocs.push(`${asteriskMatch.index}_${lineIndex + 1}`);
        }
      }
    }

    if (asteriskLocs.length > 0) {
      asteriskLocs.forEach((asteriskLoc) => {
        if (asterisksData.hasOwnProperty(asteriskLoc)) {
          asterisksData[asteriskLoc].push(Number(numberMatch[0]));
        } else {
          asterisksData[asteriskLoc] = [];
          asterisksData[asteriskLoc].push(Number(numberMatch[0]));
        }
      });
    }
  }

  return asterisksData;
}, {});

const sum = Object.values(asterisksData).reduce(
  (sum, arr) =>
    arr.length > 1 ? sum + arr.reduce((pre, crr) => pre * crr) : sum,
  0
);

console.log(sum);
