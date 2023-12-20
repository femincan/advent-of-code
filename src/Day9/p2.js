console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');
const histories = data.map((line) =>
  line.match(/[\-\d]+/g).map((number) => Number(number))
);

let sumOfExtrapolatedValues = 0;

for (const history of histories) {
  const sequences = [history];

  while (!sequences.at(-1).every((value) => value === 0)) {
    const currentSequence = sequences.at(-1);

    for (const [index, value] of currentSequence.entries()) {
      if (index === 0) {
        sequences.push([]);
        continue;
      }

      sequences.at(-1).push(value - currentSequence[index - 1]);
    }
  }

  sumOfExtrapolatedValues += sequences.reduceRight(
    (currentDecrement, currentHistory, index) => {
      if (index === sequences.length - 1 || index === sequences.length - 2) {
        return currentHistory[0];
      }

      return currentHistory[0] - currentDecrement;
    },
    0
  );
}

console.log(sumOfExtrapolatedValues);

console.timeEnd('Execution Time');
