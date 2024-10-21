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

const matchCounts = data.map((line) => getMatchedNumbersCount(line));

const getCopiesCount = (index) => {
  const matchCount = matchCounts[index];
  let totalCopiesCount = matchCount;

  if (matchCount > 0) {
    for (let i = 1; i <= matchCount; i++) {
      totalCopiesCount += getCopiesCount(index + i);
    }
  }

  return totalCopiesCount;
};

const totalCardsCount = matchCounts.reduce(
  (cardsCount, _, index) => cardsCount + getCopiesCount(index),
  matchCounts.length
);

console.log(totalCardsCount);
