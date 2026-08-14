import { Transform } from "node:stream";

export function parseJson() {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
      try {
        this.push(JSON.parse(chunk));
        callback();
      } catch (err) {
        callback(err);
      }
    },
  });
}
