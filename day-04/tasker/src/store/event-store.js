import { createReadStream, readFile } from "node:fs";
import { appendFile, open } from "node:fs/promises";

export class EventStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.nextTaskId = 1;
  }

  async initialize() {
    try {
      const file = await open(this.filePath);

      for await (const line of file.readLines()) {
        this.nextTaskId = Number(JSON.parse(line).id) + 1;
      }

      await file.close();
    } catch (err) {
      console.error("Failed to read file", err);
    }
  }

  async append(event) {
    try {
      await appendFile(
        this.filePath,
        JSON.stringify({
          type: "task.created",
          id: this.nextTaskId,
          title: event.taskName,
          priority: event.priority,
        }) + "\n",
        {
          flush: true,
        },
      );

      this.nextTaskId++;
    } catch (err) {
      console.error("Fail to append task: ", err);
    }
  }
}
