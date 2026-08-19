import { createServer } from "node:http";

import { readBody } from "./body-parser.js";
import { sendJson } from "./send-json.js";

class LockStore {
  #locks;
  #cleanupInterval;

  constructor() {
    this.#locks = new Map();
  }

  acquire(key, lockId, options) {
    const existingLock = this.#locks.get(key);

    if (existingLock) {
      if (existingLock.expiresAt <= Date.now()) {
        this.#locks.delete(key);
      } else {
        return false;
      }
    }

    this.#locks.set(key, {
      lockId,
      expiresAt: Date.now() + options.PX,
      ...options,
    });

    return true;
  }

  release(key, lockId) {
    const lock = this.#locks.get(key);

    if (!lock) {
      return "nil";
    }

    if (lock.lockId !== lockId) {
      return "nil";
    }

    this.#locks.delete(key);

    return "OK";
  }

  get(key) {
    if (this.#locks.has(key)) return this.#locks.get(key);
    return null;
  }

  getAll() {
    return this.#locks;
  }

  renew(key, lockId, ttl) {
    const lock = this.#locks.get(key);

    if (!lock) {
      return {
        renewed: false,
        reason: "LOCK_NOT_FOUND",
      };
    }

    const now = Date.now();

    if (lock.expiresAt <= now) {
      this.#locks.delete(key);

      return {
        renewed: false,
        reason: "LOCK_EXPIRED",
      };
    }

    if (lock.lockId !== lockId) {
      return {
        renewed: false,
        reason: "NOT_LOCK_OWNER",
      };
    }

    lock.expiresAt = now + ttl;

    return {
      renewed: true,
      expiresAt: lock.expiresAt,
    };
  }

  startCleanup(interval = 1000) {
    this.#cleanupInterval = setInterval(() => {
      const now = Date.now();

      for (const [key, lock] of this.#locks) {
        if (lock.expiresAt <= now) {
          this.#locks.delete(key);
        }
      }
    }, interval);
  }

  stopCleanup() {
    this.clearInterval(this.#cleanupInterval);
  }
}

const lockStore = new LockStore();

lockStore.startCleanup();

const server = createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === "POST" && req.url === "/lock/acquire") {
    try {
      const body = await readBody(req);
      const { key, lockId, options } = body;

      if (!key || !lockId || !options.NX || !options.PX || !options.owner) {
        return sendJson(res, 400, {
          error: "key, lockId, owner and PX are required",
        });
      }

      const acquired = lockStore.acquire(key, lockId, options);

      if (!acquired) {
        return sendJson(res, 409, {
          acquired,
          error: "Lock already exists",
        });
      }

      return sendJson(res, 200, {
        acquired,
        key,
        lockId,
        options,
      });
    } catch (err) {
      return sendJson(res, 400, {
        error: err.message,
      });
    }
  }

  if (req.method === "POST" && req.url === "/lock/release") {
    try {
      const body = await readBody(req);

      const { key, lockId } = body;

      if (!key || !lockId) {
        return sendJson(res, 400, {
          error: "key and lockId are required",
        });
      }

      const released = lockStore.release(key, lockId);

      if (released === "nil") {
        return sendJson(res, 409, {
          released: false,
          error: "Lock does not exit or is not owned by lockId",
        });
      }

      return sendJson(res, 200, {
        released: "OK",
        key,
      });
    } catch (error) {
      return sendJson(res, 400, {
        error: error.mesasge,
      });
    }
  }

  if (req.method === "POST" && req.url === "/lock/renew") {
    try {
      const body = await readBody(req);

      const { key, lockId, ttl } = body;

      if (!key || !lockId || !ttl) {
        return sendJson(res, 400, {
          error: "key, lockId and ttl are required",
        });
      }

      const result = lockStore.renew(key, lockId, ttl);

      if (!result.renewed) {
        return sendJson(res, 400, result);
      }

      return sendJson(res, 200, {
        renewed: true,
        key,
        lockId,
        expiresAt: result.expiresAt,
      });
    } catch (error) {
      return sendJson(res, 400, {
        error: error.message,
      });
    }
  }
});

server.listen(4000, () => {
  console.log("Lock server running on http://localhost:4000");
});
