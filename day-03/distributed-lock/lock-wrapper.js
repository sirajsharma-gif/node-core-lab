export class CreateLockServer {
  #url;
  constructor(url) {
    this.#url = url;
  }
  async set(key, lockId, options) {
    const res = await fetch(`${this.#url}/lock/acquire`, {
      body: JSON.stringify({
        key,
        lockId,
        options,
      }),
      method: "POST",
    });

    const data = await res.json();
    return data;
  }

  async release(key, lockId) {
    const res = await fetch(`${this.#url}/lock/release`, {
      body: JSON.stringify({
        key,
        lockId,
      }),
      method: "POST",
    });

    const data = await res.json();
    return data;
  }

  async renew(key, lockId, ttl) {
    const res = await fetch(`${this.#url}/lock/renew`, {
      body: JSON.stringify({
        key,
        lockId,
        ttl,
      }),
      method: "POST",
    });

    const data = await res.json();
    return data;
  }
}

// const createLockServer = new CreateLockServer("http://localhost:4000");
// const lockId = crypto.randomUUID();
// createLockServer.set("product:1", lockId, {
//   NX: true,
//   PX: 10_000,
//   owner: "app-1",
// });

// createLockServer.renew("product:1", lockId, 5000);

// createLockServer.set("product:1", crypto.randomUUID(), {
//   NX: true,
//   PX: 3000,
//   owner: "app-2",
// });

// setTimeout(() => {
//   createLockServer.set("product:1", crypto.randomUUID(), {
//     NX: true,
//     PX: 3000,
//     owner: "app-3",
//   });
// }, 10_000);
