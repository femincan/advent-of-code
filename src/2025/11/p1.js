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
  return dfs('you');
}

console.log(measureExecutionTime(main));

function dfs(node) {
  if (cache.has(node)) return cache.get(node);

  if (node === 'out') return 1;

  if (!graph.has(node)) return 0;

  let total = 0;
  for (const destNode of graph.get(node)) {
    total += dfs(destNode);
  }

  cache.set(node, total);

  return total;
}
