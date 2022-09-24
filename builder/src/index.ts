import chokidar from "chokidar";
import rimraf from "rimraf";

import { generateData } from "./data-generator";
import { contributorDataPath, dataPath, paginationDataPath, postsDataPath, postsPath } from "./common";

const folders = [`${contributorDataPath}/**/*`, `${postsDataPath}/**/*.*`, `${paginationDataPath}/**/*.*`, `${dataPath}/**/*.*`];

const watcher = chokidar.watch('file, dir, glob, or array', {
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
