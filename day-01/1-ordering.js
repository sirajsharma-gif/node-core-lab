import { readFile } from "fs";

console.log("Start");

process.nextTick(() => {
  console.log("nextTick");
});

Promise.resolve().then(() => console.log("Promise"));

setTimeout(() => {
  console.log("setTimeout");
}, 0);

setImmediate(() => {
  console.log("setImmediate");
});

readFile("test.txt", () => {
  console.log("readFile");

  process.nextTick(() => {
    console.log("readFile-nextTick");
  });

  Promise.resolve().then(() => console.log("readFile-Promise"));

  setTimeout(() => {
    console.log("readFile-setTimeout");
  }, 0);

  setImmediate(() => {
    console.log("readFile-setImmediate");
  });
});

console.log("End");
