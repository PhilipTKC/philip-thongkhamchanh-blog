import path from "path";
import fs from "fs";
import dayjs from "dayjs";
import { Traverse } from "./data-generator";

export const rootPath = path.resolve(__dirname, "../../");

const dataPath = path.resolve(rootPath, "content/data");
const paginationDataPath = path.resolve(rootPath, "content/pagination");
const contributorDataPath = path.resolve(rootPath, "content/authors-data");
const postsDataPath = path.resolve(rootPath, "content/posts-data");
const postsPath = path.resolve(rootPath, "content/posts");

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, { encoding: "utf8" });
}

function toSlugDate(date: Date): string {
  const dateFormat = "YYYY-MM-DD";
  return dayjs(date).format(dateFormat);
}

type PostPosition = "entry" | "tail";

function writePositionFile(postion: PostPosition, traverse?: Traverse): void {
  const filePath = `${dataPath}/${postion}.json`;

  if (traverse) {
    fs.writeFileSync(filePath, JSON.stringify(traverse));
  } else {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
}

function writePaginationFile(page: number, postData: Traverse[]): void {
  fs.writeFileSync(`${paginationDataPath}/${page}.json`, JSON.stringify(postData));
}

export {
  contributorDataPath,
  postsPath,
  dataPath,
  postsDataPath,
  paginationDataPath,
  readFile,
  toSlugDate,
  writePositionFile,
  writePaginationFile,
};
