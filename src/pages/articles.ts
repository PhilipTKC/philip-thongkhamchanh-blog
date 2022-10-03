import { Parameters, IRouteableComponent } from "@aurelia/router";

import { IPostService } from "services";

import configuration from "../../blog.config.json";
import pagination from "../../content/pagination/pages.json";

export class Articles implements IRouteableComponent {
  static title = (node): string => {
    return `Articles | Page ${node.currentPage}`;
  };

  private blogPosts = [];

  private currentPage: number;

  private currentPosts = 1;

  private error: boolean;

  private readonly pages = pagination.pages;

  private readonly postPerPage = configuration.postsPerPage + 1;

  constructor (
    @IPostService private readonly posts: IPostService
  ) { }

  async loading (parameters: Parameters): Promise<void> {
    const page = Number(parameters.page) || 1;
    if (Object.keys(parameters).length > 0)
    {
      await this.retrievePage(page);
      this.currentPage = page;
    } else
    {
      await this.retrievePage(1);
      this.currentPage = 1;
    }
  }

  async retrievePage (page: number): Promise<void> {
    const blogPost = await this.posts.retrievePage(page);

    if (blogPost)
    {
      this.blogPosts = blogPost;
    } else
    {
      this.error = true;
    }
  }
}
