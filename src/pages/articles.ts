import { IRouteViewModel, Params } from "@aurelia/router";

import { IAuthorService, IPostService } from "services";

import configuration from "../../blog.config.json";
import pagination from "../../content/pagination/pages.json";

import nProgress from "nprogress";
export class Articles implements IRouteViewModel {
  private static parameters: string[] = ["page"];

  private blogPosts = [];

  private currentPage: number;

  private currentPosts = 1;

  private error: boolean;

  private readonly location = "/articles";

  private readonly pages = pagination.pages;

  private readonly postPerPage = configuration.postsPerPage + 1;

  constructor(@IAuthorService private readonly author: IAuthorService, @IPostService private readonly posts: IPostService) { }

  async load(parameters: Params): Promise<void> {
    const page = Number(parameters.page) || 1;
    if (Object.keys(parameters).length > 0) {
      await this.retrievePage(page);
      this.currentPage = page;
    } else {
      await this.retrievePage(1);
      this.currentPage = 1;
    }
  }

  attached(): void {
    window.scrollTo(0, 0);
    nProgress.done();
  }

  async retrievePage(page: number): Promise<void> {
    const blogPost = await this.posts.retrievePage(page);

    if (blogPost) {
      this.blogPosts = blogPost;
    } else {
      this.error = true;
    }
  }
}
