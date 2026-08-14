const failedApi = (ms) => new Promise((_, reject) => setTimeout(reject, ms));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function backoffDelay(fn, retries = 5, delay = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await fn(delay);
    } catch (err) {
      if (attempt === retries - 1) throw err;
      const backoff = delay * 2 ** attempt;
      console.log(`Re-atempt after ${backoff}ms`);
      await sleep(backoff);
    }
  }
}

await backoffDelay(failedApi, 5, 1000);
