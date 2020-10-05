import chokidar from "chokidar";
import { generateData } from "./data-generator";
import { contributorDataPath, dataPath, paginationDataPath, postsDataPath, postsPath } from "./common";
import rimraf from "rimraf";

const folders = [`${contributorDataPath}/**/*`, `${postsDataPath}/**/*.*`, `${paginationDataPath}/**/*.*`, `${dataPath}/**/*.*`];

const watcher = chokidar.watch("file", {
  ignored: [/(^|[/\\])\../],
  persistent: false,
});

watcher.add([`${postsPath}/**/*.md`]);

watcher.on("ready", async () => {
  for (const folder of folders) {
    rimraf.sync(folder);
  }

  generateData();
});
