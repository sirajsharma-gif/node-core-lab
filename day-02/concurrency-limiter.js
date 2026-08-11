let result = [];
let cursor = 0;

async function concurrencyLimiter(limit) {
  const TASKS = [
    { id: 1, ms: 300 },
    { id: 2, ms: 100 },
    { id: 3, ms: 250 },
    { id: 4, ms: 400 },
    { id: 5, ms: 150 },
  ];

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function task(id, ms) {
    console.log(`start: ${id}`);
    await sleep(ms);
    console.log(`done: ${id}`);
    return id;
  }

  async function worker() {
    while (cursor < TASKS.length) {
      const i = cursor++;
      const currentTask = TASKS[i];
      result[i] = await task(currentTask.id, currentTask.ms);
    }
  }

  const workersArr = Array.from({ length: limit }, worker);
  const startTime = performance.now();
  await Promise.all(workersArr);
  const endTime = performance.now();
  console.log(`total: ${Math.round(endTime - startTime)}ms`);
}

const concurrencies = [1, 2, 3, 5, 10];

for (const concurrency of concurrencies) {
  console.log(`\n--- for limit ${concurrency} start`);
  await concurrencyLimiter(concurrency);
  console.log(`\n--- for limit ${concurrency} end`);
  result = [];
  cursor = 0;
}
