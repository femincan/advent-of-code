import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const getMatchedNumbersCount = (cardLine) => {
  const lineMatch = cardLine.match(/^Card\s+\d+: ([\d\s]+) \| ([\d\s]+)$/);

  const numberRegex = /\d+/g;
  const winningNumbers = lineMatch[1].match(numberRegex);
  const ownedNumbers = lineMatch[2].match(numberRegex);

  return ownedNumbers.filter((ownedNumber) =>
    winningNumbers.includes(ownedNumber)
  ).length;
};

const sumOfPoints = data.reduce((sumOfPoints, line) => {
  const matchedNumbersCount = getMatchedNumbersCount(line);

  if (matchedNumbersCount > 0) {
    return sumOfPoints + 2 ** (matchedNumbersCount - 1);
  }

  return sumOfPoints;
}, 0);

console.log(sumOfPoints);
