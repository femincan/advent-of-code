import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const lines = data.split('\n');
const numberLines = lines.slice(0, -1);

function main() {
  let total = 0;
  const operators = lines.at(-1).match(/[*+]/g);
  const numberLists = [];
  for (const numberLine of numberLines) {
    const numbers = numberLine.match(/\d+/g);

    for (const [i, num] of numbers.entries()) {
      if (numberLists[i]) {
        numberLists[i].push(Number(num));
      } else {
        numberLists[i] = [Number(num)];
      }
    }
  }

  for (const [i, numberList] of numberLists.entries()) {
    if (operators[i] === '+') {
      total += numberList.reduce((pre, crr) => pre + crr);
    } else {
      total += numberList.reduce((pre, crr) => pre * crr);
    }
  }

  return total;
}

console.log(measureExecutionTime(main));
