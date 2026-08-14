import { Transform } from "node:stream";

export function sumBy(keyFn, valueFn) {
  const totals = new Map();

  return new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      console.log(row);
      const key = keyFn(row);
      totals.set(key, (totals.get(key) ?? 0) + valueFn(row));
      callback();
    },
    flush(callback) {
      for (const [key, total] of totals) {
        this.push(JSON.stringify({ key, total }) + "\n");
      }

      callback();
    },
  });
}
