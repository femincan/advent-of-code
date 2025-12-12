import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);
const parsedLines = data.split('\n').map((line) => {
  const [_, lightStatesStr, buttonsStr] = line.match(/^\[(.+)\]\s(.+)\s{.+}$/);
  const expectedLightStates = lightStatesStr
    .split('')
    .map((val) => (val === '#' ? true : false));

  const buttons = buttonsStr
    .split(' ')
    .map((val) => val.slice(1, -1).split(',').map(Number));

  return { expectedLightStates, buttons };
});

function main() {
  let totalPresses = 0;

  for (const { expectedLightStates, buttons } of parsedLines) {
    buttonsLoop: for (let i = 1; i <= buttons.length; i++) {
      const buttonCombinations = getCombinations(buttons, i);

      for (const combination of buttonCombinations) {
        const lightStates = Array.from(
          { length: expectedLightStates.length },
          () => false
        );

        for (const button of combination) {
          for (const stateIndex of button) {
            lightStates[stateIndex] = !lightStates[stateIndex];
          }
        }

        if (
          expectedLightStates.every(
            (expectedState, i) => expectedState === lightStates[i]
          )
        ) {
          totalPresses += i;
          break buttonsLoop;
        }
      }
    }
  }

  return totalPresses;
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

console.log(measureExecutionTime(main));
