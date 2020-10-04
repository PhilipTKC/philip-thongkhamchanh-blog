import path from "path";
import fs from "fs";
import dayjs from "dayjs";

export type PostData = {
  date?: Date;
  id?: string;
  nextKey?: string;
  nextPost?: string;
  nextTitle?: string;
  previousKey?: string;
  previousPost?: string;
  previousTitle?: string;
  title?: string;
};

type PostPosition = "entry" | "tail";

export const rootPath = path.resolve(__dirname, "../../");

const dataPath = path.resolve(rootPath, "src/content/data");
const paginationDataPath = path.resolve(rootPath, "src/content/pagination");
const contributorDataPath = path.resolve(rootPath, "src/content/contributors_data");
const postsDataPath = path.resolve(rootPath, "src/content/posts_data");
const postsPath = path.resolve(rootPath, "src/content/posts");

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, { encoding: "utf8" });
}

function toSlugDate(date: Date): string {
  const dateFormat = "YYYY-MM-DD";
  return dayjs(date).format(dateFormat);
}

function writePositionFile(postion: PostPosition, postData?: PostData): void {
  const filePath = `${dataPath}/${postion}.json`;

  if (postData) {
    fs.writeFileSync(filePath, JSON.stringify(postData));
  } else {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
}

function writePaginationFile(page: number, postData: PostData[]): void {
  fs.writeFileSync(`${paginationDataPath}/${page}.json`, JSON.stringify(postData));
}

export {
  contributorDataPath, postsPath,
  dataPath,
  postsDataPath,
  paginationDataPath,
  readFile,
  toSlugDate,
  writePositionFile,
  writePaginationFile,
};
