import { Buffer } from "node:buffer";

const MAX_BODY_SIZE = 1024;

export const upload = (req, res) => {
  let receivedBytes = 0;
  const chunks = [];

  req.on("data", (chunk) => {
    receivedBytes += chunk.length;

    if (receivedBytes > MAX_BODY_SIZE) {
      res.statusCode = 413;
      res.end("Payload Too Large");
      req.destroy();
      return;
    }

    chunks.push(chunk);
  });

  req.on("end", () => {
    const body = Buffer.concat(chunks);

    res.setHeader("content-type", "application/json");

    res.end(
      JSON.stringify({
        message: "Upload received",
        bytes: body.length,
      }),
    );
  });

  req.on("error", (error) => {
    console.error("Request steam error: ", error);
  });
};
