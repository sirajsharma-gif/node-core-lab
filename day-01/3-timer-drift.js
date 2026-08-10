const INTERVAL_MS = 100;
const BLOCK_MS = 500;
const TOTAL_TICKS = 8;
const BLOCK_AT = 3;

let ticks = 0;
let last = performance.now();
const started = last;

function blockFor(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {}
}

const timer = setInterval(() => {
  const now = performance.now();
  const gap = now - last;
  last = now;
  ticks++;

  console.log(
    `tick ${ticks} gap ${gap.toFixed(1)}ms drift ${(gap - INTERVAL_MS).toFixed(1)}ms`,
  );

  if (ticks === BLOCK_AT) {
    console.log(`\n--- blocking the loop for ${BLOCK_MS}ms ---\n`);
    blockFor(BLOCK_MS);
  }

  if (ticks >= TOTAL_TICKS) {
    clearInterval(timer);
    const total = performance.now() - started;
    console.log(
      `\nexpected ~${TOTAL_TICKS * INTERVAL_MS}ms, actually ${total.toFixed(1)}ms`,
    );
  }
}, INTERVAL_MS);
