import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = true;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const maxLoad = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseGame = (gameLine) => {
  const game = {
    id: 0,
    maxColorCounts: {
      red: -Infinity,
      green: -Infinity,
      blue: -Infinity,
    },
  };

  const gameMatch = gameLine.match(/^Game (\d+): (.*)$/);
  game.id = Number(gameMatch[1]);

  const colorCountMatches = gameMatch[2].matchAll(/(\d+) (blue|red|green)/g);

  for (const colorCountMatch of colorCountMatches) {
    const colorCount = Number(colorCountMatch[1]);

    if (colorCount > game.maxColorCounts[colorCountMatch[2]]) {
      game.maxColorCounts[colorCountMatch[2]] = colorCount;
    }
  }

  return game;
};

const sums = data.reduce(
  (sums, line) => {
    let game = parseGame(line);
    const isPossible = Object.entries(game.maxColorCounts).every(
      ([color, count]) => count <= maxLoad[color]
    );

    return {
      sumOfGameIds: isPossible
        ? sums.sumOfGameIds + game.id
        : sums.sumOfGameIds,
      sumOfPowers:
        sums.sumOfPowers +
        Object.values(game.maxColorCounts).reduce((pre, crr) => pre * crr),
    };
  },
  { sumOfGameIds: 0, sumOfPowers: 0 }
);

console.log(sums);
