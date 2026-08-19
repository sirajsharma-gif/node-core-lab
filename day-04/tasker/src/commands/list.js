import { parseArgs } from "node:util";

export async function listCommand(args) {
  const commandArgs = args.slice(1);

  const options = {
    status: {
      type: "string",
      short: "s",
      default: "all",
    },
  };

  const { values } = parseArgs({
    args: commandArgs,
    allowPositionals: true,
    options,
  });

  console.log(`Showing ${values.status} tasks list`);
}
