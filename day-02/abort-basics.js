const signal = AbortSignal.timeout(300);

signal.addEventListener("abort", () => {
  console.log("aborted:", signal.reason.name);
});

console.log("aborted?", signal.aborted);
await new Promise((resolve) => setTimeout(resolve, 400));
console.log("aborted?", signal.aborted);
