import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);
const parsedLines = data.split('\n').map((line) => {
  const [_, buttonsStr, joltageLevelsStr] = line.match(
    /^\[.+\]\s(.+)\s{(.+)}$/
  );
  const buttons = buttonsStr
    .split(' ')
    .map((val) => val.slice(1, -1).split(',').map(Number));

  const joltageLevels = joltageLevelsStr.split(',').map(Number);

  return { buttons, joltageLevels };
});

function main() {
  let totalPresses = 0;

  for (const { buttons, joltageLevels } of parsedLines) {
    const buttonCombinations = buttons
      .map((_, i) => getCombinations(buttons, i + 1))
      .flat();
    buttonCombinations.push([]);
    const cache = new Map();

    function findMinimumPresses(joltageLevels) {
      const cacheKey = joltageLevels.join(',');

      if (cache.has(cacheKey)) return cache.get(cacheKey);

      if (joltageLevels.some((l) => l < 0)) return Infinity;

      if (joltageLevels.every((l) => l === 0)) return 0;

      const validCombinations = getValidCombinations(
        joltageLevels.map((l) => l % 2 !== 0),
        buttonCombinations
      );

      let minimumPresses = Infinity;
      for (const buttons of validCombinations) {
        const newJoltageLevels = pressButtons(buttons, joltageLevels);

        let multiplier = 1;
        if (
          !newJoltageLevels.every((l) => l === 0) &&
          newJoltageLevels.every((l) => l % 2 === 0)
        ) {
          for (let i = 0; i < newJoltageLevels.length; i++) {
            newJoltageLevels[i] /= 2;
          }
          multiplier = 2;
        }

        const result =
          buttons.length + multiplier * findMinimumPresses(newJoltageLevels);

        minimumPresses = Math.min(result, minimumPresses);
        cache.set(cacheKey, minimumPresses);
      }

      cache.set(cacheKey, minimumPresses);
      return minimumPresses;
    }

    totalPresses += findMinimumPresses(joltageLevels);
  }

  return totalPresses;
}

console.log(measureExecutionTime(main));

function pressButtons(buttons, joltageLevels) {
  const localJoltageLevels = [...joltageLevels];
  for (const button of buttons) {
    for (const idx of button) {
      localJoltageLevels[idx] -= 1;
    }
  }

  return localJoltageLevels;
}

function getValidCombinations(joltageParity, buttonCombinations) {
  const validCombinations = [];

  for (const combination of buttonCombinations) {
    const localParity = joltageParity.map(() => false);

    for (const button of combination) {
      for (const idx of button) {
        localParity[idx] = !localParity[idx];
      }
    }

    if (joltageParity.every((p, i) => p === localParity[i])) {
      validCombinations.push(combination);
    }
  }

  return validCombinations;
}

function getCombinations(arr, k) {
  if (k > arr.length) {
    return null;
  }

  if (k === 1) {
    return arr.map((item) => [item]);
  }

  const result = [];

  for (let i = 0; i < arr.length; i++) {
    const combinations = getCombinations(arr.slice(i + 1), k - 1);

    if (combinations === null) break;

    for (const combination of combinations) {
      result.push([arr[i], ...combination]);
    }
  }

  return result;
}
