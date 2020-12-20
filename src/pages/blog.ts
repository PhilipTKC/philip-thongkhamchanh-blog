import { AuthorService, PostService } from "services";
import { inject, ICustomElementViewModel } from "aurelia";
import { IRouteableComponent } from "@aurelia/router";

import configuration from "blog.config.json";
import { pages } from "content/pagination/pages.json";

import nProgress from "nprogress";

type Parameters = {
  page: string;
};

@inject(AuthorService, PostService)
export class Blog implements IRouteableComponent {
  private static parameters: string[] = ["page"];

  private blogPosts = [];

  private currentPage: number;

  private currentPosts = 1;

  private error: boolean;

  private readonly location = "/blog";

  private readonly pages = pages;

  private readonly postPerPage = configuration.postsPerPage + 1;

  constructor(private readonly author: AuthorService, private readonly posts: PostService) {}

  async load(parameters: Parameters): Promise<void> {
    const page = Number(parameters.page) || 1;
    if (Object.keys(parameters).length > 0) {
      await this.retrievePage(page);
      this.currentPage = page;
    } else {
      await this.retrievePage(1);
      this.currentPage = 1;
    }
  }

  async attached(): Promise<void> {
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
