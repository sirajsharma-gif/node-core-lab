import { readFile } from "node:fs";

let count = 0;

function itself() {
  if (count >= 1000) return;

  console.log(`itself called ${count}`);
  count++;
  process.nextTick(itself);
}

itself();

setTimeout(() => {
  console.log("setTimeout");
}, 0);

readFile("test.txt", () => {
  console.log("readFile");
});
