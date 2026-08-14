import { Transform } from "node:stream";

export function splitLines() {
  let remainder = "";

  return new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
      const lines = (remainder + chunk).split("\n");
      remainder = lines.pop();
      for (const line of lines) {
        if (line) this.push(line);
      }
      callback();
    },
    flush(callback) {
      if (remainder) this.push(remainder);
      callback();
    },
  });
}
