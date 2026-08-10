const { count, increment } = require("./counter.cjs");

console.log("Module B evaluated");

increment("B");
