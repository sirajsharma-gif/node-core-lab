import { request, Agent } from "node:http";
import { Readable, pipeline } from "node:stream";
import { createWriteStream } from "node:fs";

const outStream = createWriteStream("records.ndjson");

const readStream = new Readable({
  read(size) {
    for (let i = 1; i <= 10_000; i++) {
      this.push(
        JSON.stringify({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
        }) + "\n",
      );
    }

    this.push(null);
  },
});

const agent = new Agent({
  keepAlive: true,
  keepAliveMsecs: 30_000,
});

const req = request({
  hostname: "localhost",
  port: 3000,
  path: "/batch",
  method: "POST",
  agent: agent,
  headers: {
    "content-type": "application/x-ndjson",
  },
});

req.on("response", (res) => {
  res.pipe(outStream);

  res.on("end", () => console.log("Request completed successfuly"));
  res.on("error", (err) => console.error("Request failed: ", err));
});

readStream.pipe(req);
