export function logger(req, res, next) {
  const start = Date.now();
  console.log(`${req.method} ${req.url}`);
  next();
  console.log(`Completed in ${Date.now() - start}ms`);
}

export function auth(req, res, next) {
  const authorization = req.headers.authorization;

  if (req.url === "/events") {
    next();
    return;
  }

  if (authorization !== "Bearer secret") {
    res.statusCode = 401;
    return res.end("Unauthorized");
  }

  next();
}
