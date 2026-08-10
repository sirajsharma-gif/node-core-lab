import { readFile } from "fs";

setTimeout(() => {
  console.log("setTimeout");
}, 0);

setImmediate(() => {
  console.log("setImmediate");
});

readFile("test.txt", () => {
  setTimeout(() => {
    console.log("readFile-setTimeout");
  }, 0);

  setImmediate(() => {
    console.log("readFile-setImmediate");
  });
});
