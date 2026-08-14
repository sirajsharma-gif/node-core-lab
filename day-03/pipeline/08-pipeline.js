import { createReadStream, createWriteStream, accessSync } from "node:fs";
import { pipeline, Writable } from "node:stream";
import { createGzip } from "node:zlib";

import { splitLines } from "./03-line-transform.js";
import { parseJson } from "./05-parse-json.js";
import { filterBy } from "./06-filter-by.js";
import { sumBy } from "./07-aggregate.js";

accessSync("day-03/pipeline/events.ndjson");

const file = "day-03/pipeline/events.ndjson";

const outStream = new Writable({
  objectMode: true,
  highWaterMark: 4,
  write(chunk, encoding, callback) {
    setTimeout(() => {
      console.log(`  [sink] wrote ${chunk.id}`);
      callback();
    }, 200);
  },
});

let count = 0;

async function* log(source) {
  console.log(source);
  for await (const row of source) {
    console.log(row);
  }
}

await pipeline(
  createReadStream(file),
  splitLines(),
  parseJson(),
  filterBy((row) => row.type === "purchase"),
  log,
);
