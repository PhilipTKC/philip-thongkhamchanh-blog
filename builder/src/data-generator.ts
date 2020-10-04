import fm from "front-matter";
import rimraf from "rimraf";
import fs from "fs";

import {
  contributorDataPath,
  dataPath,
  paginationDataPath,
  PostData,
  postsDataPath,
  postsPath,
  readFile,
  toSlugDate,
  writePaginationFile,
  writePositionFile,
} from "./common";

import { postsPerPage } from "../../src/blog.config.json";
import authors from "../../src/content/contributors/contributors.json";

type FileMetaData = {
  date: Date;
  file: string;
  key: string;
  path: string;
  postDataPath: string;
  published: boolean;
  slug: string;
};

type Attributes = {
  authorId: string;
  avatar: string;
  category: string;
  date: Date;
  length: number;
  name: string;
  summary: string;
  title: string;
};

type Concatenation = {
  concatEnd: PostData;
  concatNext: PostData;
  concatStart: PostData;
};

type ContributorList = { [x: string]: any[] }[];

const foldersToClean = [`${contributorDataPath}/**/*`, `${postsDataPath}/**/*.*`, `${paginationDataPath}/**/*.*`, `${dataPath}/**/*.*`];

function generateData(): void {
  for (const folder of foldersToClean) {
    rimraf.sync(folder);
  }

  const fileData: FileMetaData[] = retrieveBlogPostFromFolder();
  writeBlogPostData(fileData);
}

function addPostToContributor(
  contributorsList: ContributorList,
  currentFileData: Attributes,
  currentAttributes: { date?: Date; id?: string; key: any }
): void {
  const authorId = currentFileData.authorId;
  const author = contributorsList.find((x) => x[authorId]);

  if (author) {
    author[authorId].push({ ...currentAttributes, title: currentFileData.title, category: currentFileData.category });
  } else {
    console.log(`Ensure "${currentAttributes.key}.md" contains an invalid author (Must match any authorId in Contributor.json)`);
  }
}

function writeBlogPostData(fileData: FileMetaData[]): void {
  if (fileData.length === 0) {
    // Write an empty entry file.
    return writePositionFile("entry");
  }

  let postsInPage: PostData[] = [];
  let pageNumber = 1;
  let remainingPosts = fileData.length - 1;

  const contributorsList: ContributorList = retrieveContributors();

  fileData.forEach((fileMetaData: FileMetaData, index: number) => {
    const { previousFileAttributes, nextFileAttributes, currentAttributes, currentFileData } = readBlogPost(fileMetaData, fileData, index);

    addPostToContributor(contributorsList, currentFileData, currentAttributes);

    const { concatStart, concatNext, concatEnd } = setMetaData(
      currentAttributes,
      previousFileAttributes,
      nextFileAttributes,
      index,
      fileData
    );

    const postData = index === 0 ? concatStart : index === fileData.length - 1 ? concatEnd : concatNext;

    postsInPage.push(postData);

    if (index === 0) {
      writePositionFile("entry", postData);
    }

    if (index === fileData.length - 1) {
      writePositionFile("tail", postData);
    }

    /*
     ** postPerPage is greater than the amount of blog post that exist
     ** Write all blog post to single page.
     */
    if (postsPerPage > fileData.length && index === fileData.length - 1) {
      writePaginationFile(pageNumber, postsInPage);
    }

    /*
     ** Push x amount of blog post determined by postPerPage and write to current pageNumber.
     */
    if (postsInPage.length >= postsPerPage && remainingPosts !== 0) {
      writePaginationFile(pageNumber, postsInPage);
      pageNumber += 1;
      postsInPage = [];
    }

    /*
     ** Write remaining blog post to file.
     */
    if (remainingPosts === 0) {
      writePaginationFile(pageNumber, postsInPage);

      // Write amount of pages to pages.json (Used to determine pages for pagination component)
      fs.writeFileSync(`${paginationDataPath}/pages.json`, JSON.stringify(Object.assign({}, { pages: pageNumber })));
    }

    fs.writeFileSync(`${postsDataPath}/${fileMetaData.key}.json`, JSON.stringify(Object.assign({}, postData)));

    remainingPosts -= 1;
  });

  saveContributorPosts(contributorsList);
}

/*
 ** TODO: Refactor
 ** Ensure that contributors.json contains unique authorId for each entry
 */
function retrieveContributors(): ContributorList {
  return authors.map((contributor) => {
    return { [contributor.authorId]: [] };
  });
}

function saveContributorPosts(contributorsList: any[]): void {
  contributorsList.forEach((contributorPostData: any, index: string | number) => {
    const authorId = Object.keys(contributorsList[index])[0];
    const chunks = chunk(contributorsList[index][authorId], 10);

    chunks.forEach((chunk, index) => {
      fs.writeFileSync(`${contributorDataPath}/${authorId}-${index + 1}.json`, JSON.stringify(chunk));
    });

    fs.writeFileSync(
      `${contributorDataPath}/${authorId}.json`,
      JSON.stringify({
        pages: chunks.length,
      })
    );
  });
}

/*
 ** https://gist.github.com/dragonza/c9642c85854305586ab5578e0f4d9493
 */
function chunk(array: any[], size: number): any[][] {
  if (!array) return [];
  const firstChunk = array.slice(0, size);
  if (!firstChunk.length) {
    return array;
  }
  return [firstChunk].concat(chunk(array.slice(size, array.length), size));
}

/*
 ** Retrieve all markdown posts from content path (Folder that holds all .md files)
 ** Returns map of all posts sorted by 'birthTime'.
 */
function retrieveBlogPostFromFolder(): FileMetaData[] {
  return fs
    .readdirSync(postsPath)
    .map((post) => {
      if (/\.(md)$/.test(post)) {
        const filePath = `${postsPath}/${post}`;
        const fileName = post.substring(0, post.indexOf("."));
        const slug = post.replace(".md", "").replace(/\s/g, "-");
        const attributes = fm(readFile(filePath)).attributes as any;

        let newFilePath: string;

        // Rename to unpublished state and skip file
        if (!attributes.published && post.charAt(0) !== "_") {
          newFilePath = `${postsPath}/_${post}`;
          fs.rename(filePath, newFilePath, (err) => {
            if (err) {
              console.log(err);
            }
          });
          return;
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

        return {
          date: attributes.date,
          file: post,
          path: newFilePath ? newFilePath : filePath,
          postDataPath: `${postsDataPath}/${fileName}.json`,
          published: attributes.published,
          slug,
          key: fileName,
        };
      }
      return;
    })
    .filter(Boolean)
    .sort((a, b) => {
      return b.date - a.date;
    });
}

/*
 ** Reads the content of the current file including the previous and next if available
 */
function readBlogPost(fileMeta: FileMetaData, metaDataArr: FileMetaData[], index: number) {
  if (fileMeta !== undefined) {
    let currentFileData: Attributes;

    try {
      const doc = fm(readFile(fileMeta.path));
      currentFileData = { ...(doc.attributes as any), length: doc.body.length };
    } catch (e) {
      console.log(e);
    }

    let previousFileAttributes: Attributes;
    if (index > 0 && index <= metaDataArr.length - 1) {
      try {
        const doc = fm(readFile(metaDataArr[index - 1].path));
        previousFileAttributes = doc.attributes as any;
      } catch (e) {
        console.log(e);
      }
    }

    let nextFileAttributes: Attributes;
    if (index >= 0 && index < metaDataArr.length - 1) {
      try {
        const doc = fm(readFile(metaDataArr[index + 1].path));
        nextFileAttributes = doc.attributes as any;
      } catch (e) {
        console.log(e);
      }
    }

    const slugDate = toSlugDate(currentFileData.date);

    const author = authors.find((x) => x.authorId === currentFileData.authorId);

    const currentAttributes = {
      author: currentFileData.authorId,
      avatar: author.avatar,
      date: currentFileData.date,
      id: `${slugDate}/${fileMeta.slug.toLowerCase()}`,
      key: fileMeta.key,
      length: currentFileData.length,
      published: fileMeta.published,
      name: author.name,
      summary: currentFileData.summary,
      title: currentFileData.title,
    };

    return { previousFileAttributes, nextFileAttributes, currentAttributes, currentFileData };
  }
}

/*
 ** Determine whether blog post has the required attributes.
 */
function isValidBlogPost(filePath: string): boolean {
  const file = readFile(filePath);
  return hasRequiredAttributes(file);
}

function hasRequiredAttributes(filePath: string): boolean {
  const attributes: Attributes = fm(readFile(filePath)) as any;

  const requiredKeys = ["authorId", "category", "date", "published", "summary", "title"];

  const isValid = requiredKeys.every((item) => {
    return Object.prototype.hasOwnProperty.call(attributes, item);
  });

  return isValid;
}

/*
 ** Set meta data for the blog post
 ** Key is filename, object holds date, id (slug), nextPost (slug), nextTitle, previousPost (slug), previousTitle
 ** Meta data is saved in a separate folder ('_data') in json format.
 ** Filename is exactly the same as the blog post name in ('_posts')
 */
function setMetaData(
  currentAttributes: PostData,
  previousFileAttributes: PostData,
  nextFileAttributes: PostData,
  index: number,
  content: FileMetaData[]
): Concatenation {
  let concatStart: PostData;

  if (index === 0) {
    concatStart = {
      ...currentAttributes,
    };

    if (content.length > 1) {
      const nextSlugDate = toSlugDate(nextFileAttributes.date);
      concatStart = {
        ...currentAttributes,
        nextKey: content[index + 1].key,
        nextPost: `${nextSlugDate}/${content[index + 1].slug.toLowerCase()}`,
        nextTitle: nextFileAttributes.title,
      };
    }
  }

  let concatPrevious: PostData;

  if (index > 0 && previousFileAttributes) {
    const previousSlugDate = toSlugDate(previousFileAttributes.date);

    concatPrevious = {
      ...currentAttributes,
      previousKey: content[index - 1].key,
      previousPost: `${previousSlugDate}/${content[index - 1].slug}`,
      previousTitle: previousFileAttributes.title,
    };
  }

  let concatNext: PostData;
  if (index > 0 && index < content.length - 1 && nextFileAttributes) {
    const nextSlugDate = toSlugDate(nextFileAttributes.date);
    concatNext = {
      ...concatPrevious,
      nextPost: `${nextSlugDate}/${content[index + 1].slug}`,
      nextTitle: nextFileAttributes.title,
      nextKey: content[index + 1].key,
    };
  }

  let concatEnd: PostData;
  if (index === content.length - 1 && content.length > 1) {
    const previousSlugDate = toSlugDate(previousFileAttributes.date);
    concatEnd = {
      ...currentAttributes,
      previousPost: `${previousSlugDate}/${content[index - 1].slug}`,
      previousTitle: previousFileAttributes.title,
      previousKey: content[index - 1].key,
    };
  }

  return { concatStart, concatNext, concatEnd };
}

export { generateData, isValidBlogPost };
