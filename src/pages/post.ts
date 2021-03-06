import { inject, IRouter, Params } from "aurelia";
import { Author, AuthorService, PostService, Attributes } from "services";
import { IRouteViewModel, RouteNode } from "@aurelia/router";

import { ITraverse } from "components/traverse";

import nProgress from "nprogress";

interface IPost {
  attributes: Attributes;
  html: string;
}

@inject(AuthorService, PostService)
export class Post implements IRouteViewModel {
  static title = (node: RouteNode): string => {
    const title = node.params.id.split("-").map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return `Article - ${title.join(" ")}`;
  
  };

  private author: Author;

  private post: IPost;

  private traverse: ITraverse;

  private postLength: number;

  constructor(private readonly authorService: AuthorService, private readonly posts: PostService, @IRouter private router: IRouter) { }

  async load(parameters: Params): Promise<void> {
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

      this.postLength = postData.length;
    }
  }
}
