import { createServer } from "node:http";
import { pipeline } from "node:stream/promises";

import { RecordParser } from "./streams/record-parser.js";
import { BatchTransform } from "./streams/batch-transform.js";
import { BatchProcessor } from "./streams/batch-processor.js";
import { ResponseTransform } from "./streams/response-transform.js";

const server = createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/batch") {
    await pipeline(
      request,
      new RecordParser({
        readableObjectMode: true,
        writableObjectMode: true,
      }),
      new BatchTransform({
        readableObjectMode: true,
        writableObjectMode: true,
        batchSize: 500,
      }),
      new BatchProcessor({
        readableObjectMode: true,
        writableObjectMode: true,
      }),
      new ResponseTransform({
        objectMode: true,
      }),
      response,
    );
  } else {
    response.statusCode = 404;
    response.end();
  }
});

server.keepAliveTimeout = 30_000;

server.listen(3000);
