import fm from "front-matter";
import fs from "fs";

import {
  contributorDataPath,
  paginationDataPath,
  postsDataPath,
  postsPath,
  readFile,
  toSlugDate,
  writePaginationFile,
  writePositionFile,
} from "./common";

import { postsPerPage } from "../../blog.config.json";
import authors from "../../content/authors/authors.json";

interface FileDataAttributes {
  date: Date;
  file: string;
  key: string;
  path: string;
  postDataPath: string;
  published: boolean;
  slug: string;
}

interface YAMLHeaders {
  author: string;
  category: string;
  date: Date;
  length: number;
  published: boolean;
  summary: string;
  title: string;
  isTemplate?: boolean;
}

interface FullHeaders extends YAMLHeaders {
  avatar: string;
  id: string;
  key: string;
  name: string;
}

interface Result {
  attributes: YAMLHeaders;
  body: string;
  bodyBegin: number;
  frontmatter: string;
}

interface AuthorPost { [author: string]: YAMLHeaders[] | [] }

type AuthorPostsList = AuthorPost[];

interface Author {
  author: string;
  authorDescription: string;
  avatar: string;
  email: string;
  name: string;
  twitter: string;
  website: string;
}

interface Traverse {
  date: Date;
  id?: string;
  nextKey?: string;
  nextPost?: string;
  nextTitle?: string;
  previousKey?: string;
  previousPost?: string;
  previousTitle?: string;
  title?: string;
}

interface Concatenation {
  end: Traverse;
  next: Traverse;
  start: Traverse;
}

function generateData(): void {
  const fileData: FileDataAttributes[] = retrieveBlogPostFromFolder();
  writeBlogPostData(fileData);
}

/*
 ** Retrieve all markdown posts from content path
 ** Returns map of all posts sorted by 'date' YAML header
 ** TODO: Refactor
 */
function retrieveBlogPostFromFolder(): FileDataAttributes[] {
  return fs
    .readdirSync(postsPath)
    .map((fileNameWithExt: string) => {
      if (/\.(md)$/.test(fileNameWithExt)) {
        /*
         ** TODO
         ** Validate filename / rename file
         */

        const filePath = `${postsPath}/${fileNameWithExt}`;
        const { attributes, isValid } = hasRequiredAttributes(filePath);

        if (!isValid) {
          return;
        }

        let fileNameWithoutExt: string;
        let extractedName: string;
        const { newFilePath, draft } = SetPublishedState(attributes, fileNameWithExt, filePath);

        if (draft) {
          return;
        }

        if (newFilePath) {
          extractedName = newFilePath.split("/").pop();
          fileNameWithoutExt = extractedName.substring(0, extractedName.indexOf("."));
        } else {
          fileNameWithoutExt = fileNameWithExt.substring(0, fileNameWithExt.indexOf("."));
        }

        return {
          date: attributes.date,
          file: fileNameWithoutExt,
          key: fileNameWithoutExt,
          path: newFilePath ? newFilePath : filePath,
          postDataPath: `${postsDataPath}/${fileNameWithoutExt}.json`,
          published: attributes.published,
          slug: fileNameWithoutExt,
        };
      }

      return;
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aTime = a.date.getTime();
      const bTime = b.date.getTime();
      return bTime - aTime;
    });
}

/*
 ** Determine whether blog post has the required attributes.
 */
function hasRequiredAttributes(filePath: string) {
  const frontMatter = fm(readFile(filePath)) as Result;
  const attributes = frontMatter.attributes;

  const requiredKeys = ["author", "category", "date", "published", "summary", "title"];

  let isValid = true;
  Object.keys(attributes).forEach((key) => {
    const value = attributes[key];

    const hasKey = requiredKeys.includes(key);

    if (!hasKey || value === null) {
      isValid = false;
      return;
    }
  });

  if (!isValid && !attributes.isTemplate) {
    console.log(`Please check the YAML header on the following file \n${filePath}`);
  }

  return { attributes, isValid };
}

function SetPublishedState(attributes: any, post, filePath: string) {
  let newFilePath: string;

  // Rename to unpublished state and skip file
  if (!attributes.published && post.charAt(0) !== "_") {
    newFilePath = `${postsPath}/_${post}`;
    fs.rename(filePath, newFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });

    return { newFilePath, draft: true };
  }

  // Rename back to published state.
  if (attributes.published && post.charAt(0) === "_") {
    newFilePath = `${postsPath}/${post.substring(1)}`;
    fs.rename(`${postsPath}/${post}`, newFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  return { newFilePath, draft: false };
}

function writeBlogPostData(fileDataArr: FileDataAttributes[]): void {
  /*
   ** Create an empty JSON file.
   */
  if (fileDataArr.length === 0) {
    writePositionFile("entry");
    writePaginationFile(1, []);
    // Move to a function
    fs.writeFileSync(`${paginationDataPath}/pages.json`, JSON.stringify(Object.assign({}, { pages: 1 })));
    return;
  }

  let traverseArr: Traverse[] = [];
  let pageNumber = 1;
  let remainingPosts = fileDataArr.length - 1;

  const authorList: AuthorPostsList = retrieveAuthors();

  fileDataArr.forEach((file: FileDataAttributes, index: number) => {
    const { previousFileAttributes, attributes, nextFileAttributes } = readBlogPost(file, fileDataArr, index);

    addPostToAuthor(authorList, attributes);

    const { start, next, end } = setTraverseData(attributes, previousFileAttributes, nextFileAttributes, index, fileDataArr);

    const post = index === 0 ? start : index === fileDataArr.length - 1 ? end : next;

    traverseArr.push(post);

    if (index === 0) {
      writePositionFile("entry", post);
    }

    if (index === fileDataArr.length - 1) {
      writePositionFile("tail", post);
    }

    /*
     ** postPerPage is greater than the amount of blog post that exist
     ** Write all blog post to single page.
     */
    if (postsPerPage > fileDataArr.length && index === fileDataArr.length - 1) {
      writePaginationFile(pageNumber, traverseArr);
    }

    /*
     ** Push x amount of blog post determined by postPerPage and write to current pageNumber.
     */
    if (traverseArr.length >= postsPerPage && remainingPosts !== 0) {
      writePaginationFile(pageNumber, traverseArr);
      pageNumber += 1;
      traverseArr = [];
    }

    /*
     ** Write remaining blog post to file.
     */
    if (remainingPosts === 0) {
      writePaginationFile(pageNumber, traverseArr);

      // Write amount of pages to pages.json (Used to determine pages for pagination component)
      fs.writeFileSync(`${paginationDataPath}/pages.json`, JSON.stringify(Object.assign({}, { pages: pageNumber })));
    }

    fs.writeFileSync(`${postsDataPath}/${file.key}.json`, JSON.stringify(Object.assign({}, post)));

    remainingPosts -= 1;
  });

  saveAuthorPosts(authorList);
}

function addPostToAuthor(authorPostList: AuthorPostsList, attributes: FullHeaders): void {
  const authorName = attributes.author;
  const author: AuthorPost = authorPostList.find((x) => x[authorName]);

  if (authorName) {
    (author[authorName] as YAMLHeaders[]).push({ ...attributes, title: attributes.title, category: attributes.category });
  } else {
    console.log(`Ensure "${attributes.key}.md" contains an invalid author (Must match any author in authors.json)`);
  }
}

/*
 ** TODO: Refactor
 ** Ensure that authors.json contains unique author for each entry
 */
function retrieveAuthors(): AuthorPost[] {
  return authors.map((contributor) => {
    return { [contributor.author]: [] };
  });
}

function saveAuthorPosts(authorList: AuthorPostsList): void {
  for (let index = 0; index < authorList.length; index += 1) {
    const author: string = Object.keys(authorList[index])[0];

    /*
     ** chunkSize === 0 returns YAMLHeaders[]
     ** chunkSize > 0 returns YAMLHeaders[][]
     */
    const chunks = chunk(authorList[index][author], 10);

    (chunks as YAMLHeaders[][]).forEach((chunk: YAMLHeaders[], index: number) => {
      fs.writeFileSync(`${contributorDataPath}/${author}-${index + 1}.json`, JSON.stringify(chunk));
    });

    fs.writeFileSync(
      `${contributorDataPath}/${author}.json`,
      JSON.stringify({
        pages: chunks.length,
      })
    );
  }
}

/*
 ** https://gist.github.com/dragonza/c9642c85854305586ab5578e0f4d9493
 */
function chunk(authorArr: YAMLHeaders[], size: number): YAMLHeaders[] | YAMLHeaders[][] {
  if (!authorArr) return [];

  const firstChunk = authorArr.slice(0, size);
  if (!firstChunk.length) {
    return authorArr;
  }

  return [firstChunk].concat(chunk(authorArr.slice(size, authorArr.length), size));
}

/*
 ** Reads the content of the current file including the previous and next if available
 */
function readBlogPost(file: FileDataAttributes, fileArr: FileDataAttributes[], index: number) {
  if (file !== undefined) {
    let currentFileData: YAMLHeaders;

    try {
      const doc = fm(readFile(file.path)) as Result;
      currentFileData = { ...doc.attributes, length: doc.body.length };
    } catch (e) {
      console.log(e);
    }

    let previousFileAttributes: YAMLHeaders;
    if (index > 0 && index <= fileArr.length - 1) {
      try {
        const doc = fm(readFile(fileArr[index - 1].path)) as Result;
        previousFileAttributes = doc.attributes;
      } catch (e) {
        console.log(e);
      }
    }

    let nextFileAttributes: YAMLHeaders;
    if (index >= 0 && index < fileArr.length - 1) {
      try {
        const doc = fm(readFile(fileArr[index + 1].path)) as Result;
        nextFileAttributes = doc.attributes;
      } catch (e) {
        console.log(e);
      }
    }

    const slugDate = toSlugDate(currentFileData.date);
    const authorObj: Author = authors.find((x: Author) => x.author === currentFileData.author);

    const attributes: FullHeaders = {
      ...currentFileData,
      avatar: authorObj.avatar,
      id: `${slugDate}/${file.slug.toLowerCase()}`,
      key: file.key,
      name: authorObj.name,
      published: file.published,
    };

    return { previousFileAttributes, attributes, nextFileAttributes };
  }
}

/*
 ** Set meta data for the blog post
 ** Key is filename, object holds date, id (slug), nextPost (slug), nextTitle, previousPost (slug), previousTitle
 ** Meta data is saved in a separate folder ('_data') in json format.
 ** Filename is exactly the same as the blog post name in ('_posts')
 */
function setTraverseData(start: Traverse, previous: Traverse, next: Traverse, index: number, FileArr: FileDataAttributes[]): Concatenation {
  let concatStart: Traverse;

  if (index === 0) {
    concatStart = {
      ...start,
    };

    if (FileArr.length > 1) {
      const nextSlugDate = toSlugDate(next.date);
      concatStart = {
        ...start,
        nextKey: FileArr[index + 1].key,
        nextPost: `${nextSlugDate}/${FileArr[index + 1].slug.toLowerCase()}`,
        nextTitle: next.title,
      };
    }
  }

  let concatPrevious: Traverse;

  if (index > 0 && previous) {
    const previousSlugDate = toSlugDate(previous.date);

    concatPrevious = {
      ...start,
      previousKey: FileArr[index - 1].key,
      previousPost: `${previousSlugDate}/${FileArr[index - 1].slug}`,
      previousTitle: previous.title,
    };
  }

  let concatNext: Traverse;
  if (index > 0 && index < FileArr.length - 1 && next) {
    const nextSlugDate = toSlugDate(next.date);
    concatNext = {
      ...concatPrevious,
      nextPost: `${nextSlugDate}/${FileArr[index + 1].slug}`,
      nextTitle: next.title,
      nextKey: FileArr[index + 1].key,
    };
  }

  let concatEnd: Traverse;
  if (index === FileArr.length - 1 && FileArr.length > 1) {
    const previousSlugDate = toSlugDate(previous.date);
    concatEnd = {
      ...start,
      previousPost: `${previousSlugDate}/${FileArr[index - 1].slug}`,
      previousTitle: previous.title,
      previousKey: FileArr[index - 1].key,
    };
  }

  return { start: concatStart, next: concatNext, end: concatEnd };
}

export { generateData, Traverse };
