const example = false;
const input = (
  await Bun.file(
    `${import.meta.dir}/${example ? 'example.txt' : 'input.txt'}`
  ).text()
).split('\n');

const crrPath = [];
const dirSizeMap = new Map();
let crrSize = 0;
for (const line of input) {
  const lineItems = line.split(' ');

  if (lineItems[0] === '$') {
    if (lineItems[1] === 'cd') {
      putSizes();
      crrSize = 0;
      if (lineItems[2] === '..') {
        crrPath.pop();
      } else {
        crrPath.push(lineItems[2]);
      }
    }
  } else {
    if (lineItems[0] !== 'dir') {
      crrSize += parseInt(lineItems[0]);
    }
  }
}

putSizes();
const diff = 30_000_000 - (70_000_000 - dirSizeMap.get('/'));
let minSize = Infinity;
dirSizeMap.forEach((size) => {
  if (size > diff && size < minSize) {
    minSize = size;
  }
});
console.log(minSize);

function putSizes() {
  for (let i = crrPath.length; i > 0; i--) {
    const dirPath = '/' + crrPath.slice(1, i).join('/');
    const dirSize = dirSizeMap.get(dirPath) ?? 0;
    const newSize = dirSize + crrSize;
    dirSizeMap.set(dirPath, newSize);
  }
}
