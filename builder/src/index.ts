import chokidar from "chokidar";
import { generateData } from "./data-generator";
import { postsPath } from "./common";

const watcher = chokidar.watch("file", {
  ignored: [/(^|[/\\])\../],
  persistent: false,
});

watcher.add([`${postsPath}/**/*.md`]);

watcher.on("ready", async () => {
  generateData();
});
