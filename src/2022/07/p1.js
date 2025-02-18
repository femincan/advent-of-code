const example = false;
const input = (
  await Bun.file(
    `${import.meta.dir}/${example ? 'example.txt' : 'input.txt'}`
  ).text()
).split('\n');

const crrPath = [];
const dirSizeMap = new Map();
const largeDirs = new Set();
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
console.log(Array.from(dirSizeMap.values()).reduce((pre, crr) => pre + crr, 0));

function putSizes() {
  for (let i = crrPath.length; i > 0; i--) {
    const dirPath = '/' + crrPath.slice(1, i).join('/');
    const dirSize = dirSizeMap.get(dirPath) ?? 0;
    const newSize = dirSize + crrSize;
    if (newSize > 100_000) {
      dirSizeMap.delete(dirPath);
      largeDirs.add(dirPath);
    } else {
      if (!largeDirs.has(dirPath)) {
        dirSizeMap.set(dirPath, newSize);
      }
    }
  }
}
