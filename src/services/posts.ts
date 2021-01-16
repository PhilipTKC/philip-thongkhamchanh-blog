interface PostData {
  date: string;
  id: string;
  key: string;
  length?: number;
  nextKey?: string;
  nextPost?: string;
  nextTitle?: string;
  previousKey?: string;
  previousPost?: string;
  previousTitle?: string;
}

export interface Attributes {
  authorId: string;
  category: string;
  title: string;
  date: Date;
  summary: string;
}

export class PostService {
  async retrievePage(page: number): Promise<any> {
    try {
      const pageContent = await import(`../../content/pagination/${page}.json`).then(({ default: _ }) => _);
      return pageContent;
    } catch (_) {
      return undefined;
    }
  }

  async retrievePost(entry: PostData | string): Promise<any> {
    try {
      if (typeof entry === "string") {
        const post = await import(`../../content/posts/${entry}.md`).then(({ default: _ }) => _);
        return post;
      }
    } catch (_) {
      return undefined;
    }
  }

  async retrieveData(entry: PostData | string): Promise<PostData> {
    try {
      if (typeof entry === "string") {
        const data = await import(`../../content/posts-data/${entry}.json`).then(({ default: _ }) => _);
        return data;
      }
    } catch (_) {
      return undefined;
    }
  }
}
