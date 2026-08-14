import { createServer } from "node:http";
import crypto from "node:crypto";

import { CreateLockServer } from "./lock-wrapper.js";
import { sendJson } from "./send-json.js";

const PORT = Number(process.env.PORT || 3001);
const SERVER_ID = process.env.SERVER_ID || "app-server";

const LOCK_TTL = 10_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lockServer = new CreateLockServer("http://localhost:4000");

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/process") {
    const resourceKey = "product:1";
    const lockId = crypto.randomUUID();

    console.log(`[${SERVER_ID}] Request received`);

    console.log(`[${SERVER_ID}] Trying to acquire lock...`);

    try {
      const result = await lockServer.set(resourceKey, lockId, {
        owner: SERVER_ID,
        NX: true,
        PX: LOCK_TTL,
      });

      if (!result.acquired) {
        console.log(`[${SERVER_ID}] Failed to acquire lock`);

        return sendJson(res, 409, {
          success: false,
          message: "Resource is currently locked",
        });
      }

      console.log(`[${SERVER_ID}] lock acquired`);

      try {
        console.log(`[${SERVER_ID}] Processing resource...`);

        await sleep(5000);

        console.log(`[${SERVER_ID}] Processing completed`);

        return sendJson(res, 200, {
          sucess: true,
          server: SERVER_ID,
          message: "Resource processed",
        });
      } finally {
        console.log(`[${SERVER_ID}] Releasing lock...`);

        await lockServer.release(resourceKey, lockId);

        console.log(`[${SERVER_ID}] Lock released`);
      }
    } catch (err) {
      console.error(`[${SERVER_ID}] Error:`, err);

      return sendJson(res, 500, {
        success: false,
        error: "Internal server error",
      });
    }

    return sendJson(res, 404, {
      error: "Route not found",
    });
  }
});

server.listen(PORT, () => {
  console.log(`[${SERVER_ID}] Running on http://localhost:${PORT}`);
});
