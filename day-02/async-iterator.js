const API_URL = "https://pokeapi.co/api/v2/pokemon";

async function fetchPokemons(offset = 0, limit = 10) {
  const url = new URL(API_URL);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);

  const response = await fetch(url.toString());
  return await response.json();
}

async function* fetchPages() {
  const limit = 10;
  let offset = 0;
  let totalRecords = null;

  try {
    do {
      const data = await fetchPokemons(offset, limit);
      totalRecords ??= data.count;
      offset += 10;
      yield data.results;
    } while (offset < totalRecords);
  } catch (err) {
    console.log(err);
  }
}

async function* fetchAll() {
  try {
    for await (const results of fetchPages()) {
      yield* results;
    }
  } finally {
    console.log("Data fetch completed");
  }
}

let count = 1;

const limit = Number(process.argv?.[2]) || 15;

for await (const record of fetchAll()) {
  console.log(record);
  if (count === limit) break;
  count++;
}
