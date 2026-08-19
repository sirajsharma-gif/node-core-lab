import { Transform } from "node:stream";

import { sleep } from "../utils/sleep.js";

export class BatchProcessor extends Transform {
  constructor(options) {
    super(options);
    this.batchNumber = 0;
  }

  async _transform(chunk, encoding, callback) {
    await sleep(100);
    let count = 0;
    for (const row of chunk) {
      count++;
    }

    this.batchNumber++;

    this.push({
      batchNumber: this.batchNumber,
      received: chunk.length,
      processed: count,
      status: "success",
    });

    callback();
  }

  _flush(callback) {
    callback();
  }
}
