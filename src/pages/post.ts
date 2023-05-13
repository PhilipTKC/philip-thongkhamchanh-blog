import { Parameters, IRouteableComponent } from "@aurelia/router";
import { Author, IAuthorService, Attributes, IPostService } from "services";

import { AnimationHooks } from "lifecycle-hooks/animation-hook";
import { ITraverse } from "components/traverse";

interface IPost {
  attributes: Attributes;
  html: string;
}

export class Post implements IRouteableComponent {
  static dependencies = [AnimationHooks];

  static title = (viewModel: Post): string => viewModel.post.attributes.title;
    
  private author: Author;

  private post: IPost;

  private traverse: ITraverse;

  private postLength: number;

  constructor (
    @IAuthorService private readonly authorService: IAuthorService,
    @IPostService private readonly posts: IPostService
  ) { }

  async loading (parameters: Parameters): Promise<void> {
    const postData = await this.posts.retrieveData(parameters.id as string);
    const post = await this.posts.retrievePost(parameters.id as string);

    if (post && postData)
    {
      this.author = await this.authorService.retrieveAuthor(
        post.attributes.author
      );
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
