# philip-thongkhamchanh-blog

This project is bootstrapped by [aurelia/new](https://github.com/aurelia/new).

## Prerequisites

### Run Install

    npm install

### Start dev web server

    npm run watch:css
    npm start

### Build the app in production mode

    npm run build

## Blog Post

Create blog post inside `content/posts` as a markdown file.

The markdown file requires the following `Front Matter`

`authorId, title, date, published, summary, category`

See `content/contributors/contributors.json` for adding blog contributors. `authorId` can match any contributor id.

    ---
    authorId: PhilipTKC
    title: Lorem ipsum dolor sit amet
    date: 1970-01-01T00:00:00.000Z
    summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    category: Blog
    published: true
    ---

Blog post are ordered by `date` (ISO 8601). Simply increment T00:00:00.`000`Z portion to keep articles ordered for articles published on the same date.

If `published` is false, the build script will automatically append an underscore to the filename and remove it when `published` is true.

- [ ] TODO: Allow multiple category entries.

### Filename

The filename should be hyphenated and not contain spaces for consistency.

#### Good

`this-is-awesome.md`

#### Not Good

`this-is not awesome.md`

Build script replaces spaces in file paths/names data with hyphens for consistency.

- [ ] Update build script to automatically rename filename based on title.

### Edit Blog Post

Run build script once you're done editing to update data made to the YAML headers or content.

## Blog Builder

WIP

### Pagination

Edit `blog.config.json` to change the amount of post shown on a single page. By editing this value you must run the build command to update pagination data contained in `content/pagination`.

### Build

`cd builder`

`pnpm start`

This will update data contained inside the `content` folder.
