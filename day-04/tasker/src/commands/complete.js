import { parseArgs } from "node:util";

export async function completeCommand(args) {
  const commandArgs = args.slice(1);

  const { positionals } = parseArgs({
    args: commandArgs,
    allowPositionals: true,
  });

  const taskId = positionals?.[0];

  if (!taskId) {
    console.error("Error: Task ID required.");
    process.exitCode = 1;
    process.exit();
  }

  console.log(`Completed task ${taskId}`);
}
