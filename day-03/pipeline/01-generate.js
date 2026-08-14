import { createWriteStream, mkdirSync } from "node:fs";
import { once } from "node:events";

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];

const makeRow = (id) => ({
  id: id,
  userId: randInt(0, id),
  type: pick(["purchase", "view", "refund"]),
  amount: randInt(1, 500),
});

mkdirSync("data", { recursive: true });

const ROWS = 500_000;
const outStream = createWriteStream("data/events.ndjson");

const started = performance.now();

for (let i = 1; i <= ROWS; i++) {
  const row = JSON.stringify(makeRow(i)) + "\n";

  if (!outStream.write(row)) {
    await once(outStream, "drain");
  }

  if (i % 50_000 === 0) {
    const mb = (process.memoryUsage().rss / 1024 / 1024).toFixed(0);
    console.log(`   ${i} rows written, RSS ${mb} MB`);
  }
}

console.log(`buffered but not written: ${outStream.writableLength} bytes`);
outStream.end();
await once(outStream, "finish");

const elapsed = performance.now() - started;
console.log(`done in ${elapsed.toFixed(0)}ms`);
console.log(`buffered at end: ${outStream.writableLength} bytes`);
