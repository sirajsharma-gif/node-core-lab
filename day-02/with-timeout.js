function rejectOnAbort(signal) {
  return new Promise((_, reject) => {
    if (signal.aborted) return reject(signal.reason);
    signal.addEventListener("abort", () =>
      reject(signal.reason, { once: true }),
    );
  });
}

export async function withTimeout(fn, ms, externalSignal) {
  const signal = externalSignal
    ? AbortSignal.any([externalSignal, AbortSignal.timeout(ms)])
    : AbortSignal.timeout(ms);

  return Promise.race([fn(signal), rejectOnAbort(signal)]);
}
