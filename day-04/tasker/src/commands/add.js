import { parseArgs } from "node:util";

export async function addCommand(args, eventStore) {
  const commandArgs = args.slice(1);

  const options = {
    priority: {
      type: "string",
      short: "p",
      default: "normal",
    },
  };

  const { positionals, values } = parseArgs({
    args: commandArgs,
    allowPositionals: true,
    options,
  });

  const taskName = positionals.join(" ");

  if (!taskName) {
    console.error("Error: Please provide a task name.");
    exitCode = 1;
    process.exit();
  }

  await eventStore.append({
    taskName,
    priority: values.priority,
  });

  console.log("Task created");
}
