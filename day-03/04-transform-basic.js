import { Transform } from "node:stream";

const upperCaseT = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

process.stdin.pipe(upperCaseT).pipe(process.stdout);
