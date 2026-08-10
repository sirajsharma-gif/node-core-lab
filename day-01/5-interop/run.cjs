require("./consumer-a.cjs");
require("./consumer-b.cjs");
const { get } = require("./counter.cjs");

console.log(`Final count: ${get()}`);
