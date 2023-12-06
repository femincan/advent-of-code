import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = false;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');

const numbersMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const result = data.reduce((result, currentLine) => {
  const regex = new RegExp(`\\d|${Object.keys(numbersMap).join('|')}`, 'g');

  const numbers = [];

  /** @type {*} */
  let execArray;

  while ((execArray = regex.exec(currentLine)) !== null) {
    /** @type {keyof typeof numbersMap} */
    const match = execArray[0];

    if (!isNaN(Number(match))) {
      numbers.push(match);
    } else {
      const number = numbersMap[match];
      numbers.push(number);

      regex.lastIndex = regex.lastIndex - 1;
    }
  }

  if (numbers.length === 1) {
    return result + Number(numbers[0] + numbers[0]);
  } else {
    return result + Number(numbers[0] + numbers[numbers.length - 1]);
  }
}, 0);

console.log(result);
