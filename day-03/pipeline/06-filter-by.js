import { Transform } from "node:stream";

export function filterBy(predicate) {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
      if (predicate(chunk)) this.push(chunk);
      callback();
    },
  });
}
