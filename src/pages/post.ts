import { Author, AuthorService, PostService, Attributes } from "services";
import { inject, IRouter, IViewModel } from "aurelia";
import { ITraverse } from "components/traverse";

type Parameters = {
  date: string;
  id: string;
};

type IPost = {
  attributes: Attributes;
  html: string;
};

@inject(AuthorService, PostService)
export class Post implements IViewModel {
  static title = (instance: Post): string => (instance.post ? instance.post.attributes.title : "Blog Post Not Found");

  private author: Author;

  private post: IPost;

  private traverse: ITraverse;

  constructor(private readonly authorService: AuthorService, private readonly posts: PostService, @IRouter private router: IRouter) {}

  async load(parameters: Parameters): Promise<void> {
    const postData = await this.posts.retrieveData(parameters.id);
    const post = await this.posts.retrievePost(parameters.id);

    if (post && postData) {
      this.author = await this.authorService.retrieveAuthor(post.attributes.author);
      this.post = post;
      this.traverse = {
        nextTitle: postData.nextTitle,
        nextId: postData.nextPost,
        previousTitle: postData.previousTitle,
        previousId: postData.previousPost,
      };
    }
  }

  async afterAttach(): Promise<void> {
    window.scrollTo(0, 0);
    await import(/* webpackPrefetch: true */ "../css/highlighter.css");
    await import("nprogress").then(({ default: _ }) => _.done());
  }
}
