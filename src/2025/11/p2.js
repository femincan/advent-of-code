import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);
const graph = new Map(
  data.split('\n').map((line) => {
    const [node, destNodesStr] = line.split(':');

    return [node, destNodesStr.trim().split(' ')];
  })
);
const cache = new Map();

function main() {
  return dfs('svr', false, false);
}

console.log(measureExecutionTime(main));

function dfs(node, isFftVisited, isDacVisited) {
  const cacheKey = `${node}${isFftVisited ? 1 : 0}${isDacVisited ? 1 : 0}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (node === 'out') {
    if (isFftVisited && isDacVisited) {
      return 1;
    }

    return 0;
  }

  let total = 0;
  for (const destNode of graph.get(node)) {
    total += dfs(
      destNode,
      node === 'fft' || isFftVisited,
      node === 'dac' || isDacVisited
    );
  }

  cache.set(cacheKey, total);

  return total;
}
