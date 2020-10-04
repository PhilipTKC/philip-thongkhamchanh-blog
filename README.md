# philip-thongkhamchanh-blog

This project is bootstrapped by [aurelia/new](https://github.com/aurelia/new).

## Build CSS

    npm run tailwind

## Start dev web server

    npm start

## Build the app in production mode

    npm run build

# Blog Post

Create blog post inside `src/content/posts` as a markdown file.

The markdown file requires the following `Front Matter`

`authorId, title, date, published, summary, category`

See `src/content/contributors/contributors.json` for adding blog contributors. `authorId` can match any contributor id.

```
---
authorId: PhilipTKC
title: Lorem ipsum dolor sit amet
date: 1970-01-01
summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
category: Blog
published: true
---
```

Blog post are ordered by `date`.

If `published` is false, the build script will automatically append an underscore to the filename and remove it when `published` is true.

### Filename

The filename should be hyphenated and not contain spaces.

#### Good

`this-is-awesome.md`

#### Bad

`this-is not awesome.md`

Will build successfully but will not be able to find it (Will return 404 when trying to view blog post).

Build script replaces spaces in file paths/names data with hyphens for consistency.

- [ ] Update build script to automatically rename filename based on title.

### Edit Blog Post

You can edit markdown content however if you edit the frontmatter you should run the build command afterwards.

# Blog Builder

### Pagination

Edit `src/blog.config.json` to change the amount of post shown on a single page. By editing this value you must run the build command to update pagination data contained in `src/content/pagination`.

### Build

`cd builder`

`npx ts-node src/index.ts`

This will update data contained inside the `[rootDir]/src/content` folder.
