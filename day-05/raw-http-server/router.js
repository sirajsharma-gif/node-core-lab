import { createServer } from "node:http";

export class Router {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
    this.server = createServer(this.handleRequest.bind(this));

    process.on("SIGINT", () => {
      console.log("Shuting down...");

      this.server.close(() => {
        console.log("Server closed");
        process.exitCode = 0;
      });
    });
  }

  handleRequest(req, res) {
    const key = `${req.method}:${req.url}`;
    const handler = this.routes.get(key);

    if (!handler) {
      res.statusCode = 404;
      return res.end("Not Found");
    }

    let index = 0;

    const next = () => {
      const middleware = this.middlewares[index++];

      if (!middleware) {
        handler(req, res);
        return;
      }

      try {
        middleware(req, res, next);
      } catch (error) {
        this.errorHandler(error, req, res);
      }
    };

    next();
  }

  errorHandler(err, req, res) {
    console.error(err);

    if (res.headerSent) {
      return;
    }

    res.statusCode = 500;
    res.end("Internal Server Error");
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  get(path, handler) {
    this.routes.set(`GET:${path}`, handler);
  }

  post(path, handler) {
    this.routes.set(`POST:${path}`, handler);
  }

  delete(path, handler) {
    this.routes.set(`DELETE:${path}`, handler);
  }
}
