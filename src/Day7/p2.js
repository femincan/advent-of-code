console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const hands = data.map((line) => {
  const lineMatch = line.match(/\w+/g);

  return { cards: lineMatch[0], bid: Number(lineMatch[1]) };
});

let groupedHandsByType = [[], [], [], [], [], [], []];
hands.forEach((hand) => {
  const handType = getHandType(hand.cards);

  groupedHandsByType[handType].push(hand);
});

let sortedHands = [];
groupedHandsByType.forEach((handsGroup) => {
  if (handsGroup.length) {
    sortedHands.push(
      ...handsGroup.toSorted(({ cards: cards1 }, { cards: cards2 }) =>
        compareHands(cards1, cards2)
      )
    );
  }
});

const totalWinnings = sortedHands.reduce(
  (totalWinnings, { bid }, index) => totalWinnings + bid * (index + 1),
  0
);

console.log(totalWinnings);

function getHandType(hand) {
  const allCards = hand.split('');
  const cardCounts = {};

  allCards.forEach((card) => {
    if (cardCounts.hasOwnProperty(card)) {
      cardCounts[card]++;
    } else {
      cardCounts[card] = 1;
    }
  });

  if (cardCounts.hasOwnProperty('J') && cardCounts['J'] !== 5) {
    const jCount = cardCounts['J'];
    delete cardCounts['J'];

    const sortedEntries = Object.entries(cardCounts).toSorted(
      (card1, card2) => card2[1] - card1[1]
    );

    cardCounts[sortedEntries[0][0]] += jCount;
  }

  const cardCountsValues = Object.values(cardCounts);
  const cardCountsLength = cardCountsValues.length;

  switch (true) {
    case cardCountsLength === 1:
      return 6;

    case cardCountsLength === 2 &&
      cardCountsValues.some((value) => value === 4):
      return 5;

    case cardCountsLength === 2:
      return 4;

    case cardCountsLength === 3 &&
      cardCountsValues.some((value) => value === 3):
      return 3;

    case cardCountsLength === 3:
      return 2;

    case cardCountsLength === 5:
      return 0;

    default:
      return 1;
  }
}

function compareHands(hand1, hand2) {
  const cardStrengths = [
    'J',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'Q',
    'K',
    'A',
  ];
  let result = 0;

  for (let i = 0; i < 5; i++) {
    if (cardStrengths.indexOf(hand1[i]) > cardStrengths.indexOf(hand2[i])) {
      result = 1;
      break;
    }

    if (cardStrengths.indexOf(hand1[i]) < cardStrengths.indexOf(hand2[i])) {
      result = -1;
      break;
    }
  }

  return result;
}

console.timeEnd('Execution Time');
