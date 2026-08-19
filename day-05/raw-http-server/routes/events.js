export const events = (req, res) => {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "access-control-allow-origin": "*",
  });

  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ message: "Connected" })}\n\n`);

  const interval = setInterval(() => {
    const data = {
      time: new Date().toISOString(),
      value: Math.floor(Math.random() * 100),
    };

    res.write(`event: update\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 2000);

  req.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
};
