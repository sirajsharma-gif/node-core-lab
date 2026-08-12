import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

const storage = new AsyncLocalStorage();

export function withContext(fn, initial = {}) {
  const store = new Map(
    Object.entries({
      correlationId: randomUUID(),
      startedAt: Date.now(),
      ...initial,
    }),
  );
  return storage.run(store, fn);
}

export function get(key) {
  return storage.getStore()?.get(key);
}

export function set(key, value) {
  storage.getStore()?.set(key, value);
}

export function correlationId() {
  return get("correlationId") ?? "no-context";
}

export function log(message, extra = {}) {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      correlationId: correlationId(),
      elapsed: Date.now() - (get("startedAt") ?? Date.now()),
      message,
      ...extra,
    }),
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function handleRequest(id) {
  log("Handle Request started", { id });
  await sleep(2000);
  log("Handle Request ended", { id });
}

await Promise.all([
  withContext(() => handleRequest("A"), {
    correlationId: randomUUID(),
  }),
  withContext(() => handleRequest("B"), {
    correlationId: randomUUID(),
  }),
  withContext(() => handleRequest("C"), {
    correlationId: randomUUID(),
  }),
]);
