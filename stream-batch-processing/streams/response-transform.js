import { Transform } from "node:stream";

export class ResponseTransform extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const { status, ...batch } = chunk;
    if (status === "success") {
      this.push(JSON.stringify(batch) + "\n");
    }
    callback();
  }
}
