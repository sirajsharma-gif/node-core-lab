const { count, increment } = require("./counter.cjs");

console.log("Module A evaluated");

increment("A");
increment("A");
increment("A");
increment("A");
