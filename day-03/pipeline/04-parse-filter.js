import { createReadStream, accessSync } from "node:fs";
import { pipeline } from "node:stream/promises";

import { splitLines } from "./03-line-transform.js";
import { parseJson } from "./05-parse-json.js";
import { filterBy } from "./06-filter-by.js";

accessSync("day-03/pipeline/events.ndjson");

const file = "day-03/pipeline/events.ndjson";

let count = 0;

async function* log(source) {
  try {
    for await (const row of source) {
      console.log(row);

      if (count === 10) exit(0);
      count++;
    }
  } catch (error) {
    console.log("Operation aborted");
  }
}

await pipeline(
  createReadStream(file),
  splitLines(),
  parseJson(),
  filterBy((row) => row.type === "purchase"),
  log,
);
