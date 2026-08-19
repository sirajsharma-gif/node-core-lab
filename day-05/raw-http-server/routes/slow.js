export function slow(req, res) {
  setTimeout(() => {
    res.end("Finished");
  }, 10_000);
}
