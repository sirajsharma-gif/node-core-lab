import { Transform } from "node:stream";

export class RecordParser extends Transform {
  constructor(options) {
    super(options);
    this.row = "";
  }

  _transform(chunk, encoding, callback) {
    this.row = this.row + chunk.toString();

    const rows = this.row.split("\n");
    this.row = rows.pop();

    for (const row of rows) {
      this.push(JSON.parse(row));
    }

    callback();
  }

  _flush(callback) {
    if (this.row) {
      this.push(JSON.parse(this.row));
    }
    callback();
  }
}
