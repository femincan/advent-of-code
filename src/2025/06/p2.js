import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const lines = data.split('\n');
const numberLines = lines.slice(0, -1);

function main() {
  let total = 0;
  const operators = lines.at(-1).match(/[*+]/g);

  const numberLists = Array.from({ length: operators.length }, () => []);
  let k = 0;
  for (let i = numberLines[0].length - 1; i >= 0; i--) {
    let num = '';

    for (let j = 0; j < numberLines.length; j++) {
      const item = numberLines[j][i];

      if (item !== ' ') {
        num += item;
      }
    }

    if (!num) {
      k += 1;
      continue;
    }

    numberLists[k].push(parseInt(num));
  }

  for (let i = 0; i < numberLists.length; i++) {
    const numberList = numberLists.at(-(i + 1));

    if (operators[i] === '+') {
      total += numberList.reduce((pre, crr) => pre + crr);
    } else {
      total += numberList.reduce((pre, crr) => pre * crr);
    }
  }

  return total;
}

console.log(measureExecutionTime(main));
