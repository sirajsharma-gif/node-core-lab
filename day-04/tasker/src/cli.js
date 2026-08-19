import { cwd } from "node:process";

import {
  addCommand,
  completeCommand,
  listCommand,
  removeCommand,
  showCommand,
} from "./commands/index.js";

import { EventStore } from "./store/event-store.js";

const eventStore = new EventStore("./data/events.ndjson");

await eventStore.initialize();

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "add": {
    await addCommand(args, eventStore);
    break;
  }
  case "list": {
    await listCommand(args);
    break;
  }
  case "show": {
    await showCommand(args);
    break;
  }
  case "complete": {
    await completeCommand(args);
    break;
  }
  case "remove": {
    await removeCommand(args);
    break;
  }
  default: {
    console.error("Error: Enter valid command.");
    process.exitCode = 1;
    process.exit();
  }
}
