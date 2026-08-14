import { Duplex } from "node:stream";

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
  read(size) {
    this.push(String.fromCharCode(this.currrentCharCode++));
    if (this.currrentCharCode > 90) {
      this.push(null);
    }
  },
});

inoutStream.currrentCharCode = 65;

process.stdin.pipe(inoutStream).pipe(process.stdout);
