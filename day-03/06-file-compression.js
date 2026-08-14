import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";

const file = process.argv[2];

createReadStream(file)
  .pipe(createGzip())
  .pipe(createWriteStream(file + ".gz"));
