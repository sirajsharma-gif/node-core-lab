import { createReadStream, createWriteStream } from "fs";
import { createUnzip } from "node:zlib";

const file = process.argv[2];

createReadStream(file)
  .pipe(createUnzip())
  .pipe(createWriteStream("unzipped.txt"));
