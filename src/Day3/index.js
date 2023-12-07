import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const sum = data.reduce((sum, line, index) => {
  let currentLineSum = sum;
  const symbolRegex = /[^\w.]/;

  const numbersMatch = line.matchAll(/\d+/g);

  for (const numberMatch of numbersMatch) {
    let symbolAround = false;

    const lookStartIndex = numberMatch.index - 1;
    const lookEndIndex = numberMatch.index + numberMatch[0].length;

    const previousCharacter = line[lookStartIndex];
    const nextCharacter = line[lookEndIndex];
    const previousLine = data[index - 1];
    const nextLine = data[index + 1];

    if (previousCharacter) {
      symbolAround = symbolRegex.test(previousCharacter);
    }

    if (nextCharacter && !symbolAround) {
      symbolAround = symbolRegex.test(nextCharacter);
    }

    if (previousLine && !symbolAround) {
      symbolAround = previousLine
        .substring(lookStartIndex, lookEndIndex + 1)
        .split('')
        .some((character) => symbolRegex.test(character));
    }

    if (nextLine && !symbolAround) {
      symbolAround = nextLine
        .substring(lookStartIndex, lookEndIndex + 1)
        .split('')
        .some((character) => symbolRegex.test(character));
    }

    if (symbolAround) {
      currentLineSum += Number(numberMatch[0]);
    }
  }

  return currentLineSum;
}, 0);

console.log(sum);
