import { Transform } from "node:stream";

export class BatchTransform extends Transform {
  constructor(options) {
    const { batchSize = 100, ...rest } = options;
    super(rest);
    this.batchSize = options.batchSize;
    this.batch = [];
  }

  _transform(chunk, encoding, callback) {
    if (this.batch.length < this.batchSize) {
      this.batch.push(chunk);
    } else {
      this.push(this.batch);
      this.batch = [];
    }

    callback();
  }

  _flush(callback) {
    if (this.batch.length) {
      this.push(this.batch);
    }

    callback();
  }
}
