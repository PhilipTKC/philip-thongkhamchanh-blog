export interface Author {
  authorDescription: string;
  author: string;
  avatar: string;
  email: string;
  name: string;
  twitter: string;
  website: string;
};

export class AuthorService {
  async retrieveAuthor(author: string): Promise<Author> {
    try {
      const contributors = await import("content/authors/authors.json").then(({ default: _ }) => _);
      return contributors.find((x) => x.author === author);
    } catch (_) {
      return undefined;
    }
  }

  async retrieveAuthorPosts(author: string, page: number): Promise<any> {
    try {
      const authorData = await import(`content/authors-data/${author}.json`).then(({ default: _ }) => _);
      const authorPosts = await import(`content/authors-data/${author}-${page}.json`).then(({ default: _ }) => _);
      return { authorData, authorPosts };
    } catch (_) {
      return undefined;
    }
  }
}
