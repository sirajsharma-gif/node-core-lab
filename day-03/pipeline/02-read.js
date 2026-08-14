import { createReadStream } from "node:fs";

let lines = 0;
for await (const chunk of createReadStream("data/events.ndjson")) {
  for (const byte of chunk) {
    if (byte === 10) lines++;
  }
}

console.log(lines);
