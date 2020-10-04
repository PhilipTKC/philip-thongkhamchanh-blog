export type Contributor = {
  authorDescription: string;
  authorId: string;
  avatar: string;
  email: string;
  name: string;
  twitter: string;
  website: string;
};

export class AuthorService {
  async retrieveContributor(authorId: string): Promise<Contributor> {
    try {
      const contributors = await import("content/contributors/contributors.json").then(({ default: _ }) => _);
      return contributors.find((x) => x.authorId === authorId);
    } catch (_) {
      return undefined;
    }
  }

  async retrieveContributorsPosts(authorId: string, page: number): Promise<any> {
    try {
      const authorData = await import(`content/contributors_data/${authorId}.json`).then(({ default: _ }) => _);
      const authorPosts = await import(`content/contributors_data/${authorId}-${page}.json`).then(({ default: _ }) => _);
      return { authorData, authorPosts };
    } catch (_) {
      return undefined;
    }
  }
}
