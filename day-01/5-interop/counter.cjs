console.log("Counter module evaluated");

let count = 0;

function increment(who) {
  count++;
  console.log(`${who} incremented -> ${count}`);
}

function get() {
  return count;
}

module.exports = {
  get,
  increment,
};
