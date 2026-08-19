const servers = [
  {
    name: "APP_B",
    url: "http://localhost:3002/process",
  },
  {
    name: "APP_A",
    url: "http://localhost:3001/process",
  },
];

const responses = await Promise.all(
  servers.map(async (server) => {
    const response = await fetch(server.url, {
      method: "POST",
    });

    const data = await response.json();

    return {
      server: server.name,
      status: response.status,
      data: JSON.stringify(data),
    };
  }),
);

console.table(responses);
