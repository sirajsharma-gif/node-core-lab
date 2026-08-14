import { Writable } from "node:stream";

const outStream = new Writable({
  write: (chunck, encoding, callback) => {
    console.log(chunck.toString());
    callback();
  },
});

process.stdin.pipe(outStream);
