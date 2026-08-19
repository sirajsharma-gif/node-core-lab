import { ServerResponse } from "node:http";

import { Router } from "./router.js";

import { auth, logger } from "./middleware.js";

import { events } from "./routes/events.js";
import { slow } from "./routes/slow.js";
import { upload } from "./routes/upload.js";
import { users } from "./routes/users.js";

const app = new Router();

app.server.requestTimeout = 5000;
// app.server.timeout = 5000;

app.use(logger);
app.use(auth);

app.get("/users", users);
app.get("/events", events);
app.get("/slow", slow);

app.post("/users", users);
app.post("/upload", upload);

app.get("/error", (req, res) => {
  throw new Error("Something went wrong");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
