import { RouteNode } from "aurelia";
import { IRouteViewModel, Params } from "@aurelia/router";

import { Author as IContributer, IAuthorService } from "services";

import nProgress from "nprogress";

export class Author implements IRouteViewModel {
  private static title = (instance: RouteNode) => `Author - ${instance.params.author}`;

  private currentPage = 1;

  private author: IContributer;

  private authorPosts: any;

  private error: boolean;

  private location: string;

  private pages: number;

  constructor(@IAuthorService private readonly authorService: IAuthorService) { }

  async load(parameters: Params): Promise<void> {
    this.currentPage = Number(parameters.page) || 1;

    const author = await this.authorService.retrieveAuthor(parameters.author);

    if (author) {
      const { authorData, authorPosts } = await this.authorService.retrieveAuthorPosts(parameters.author, this.currentPage);
      this.author = author;
      this.authorPosts = authorPosts;
      this.pages = authorData.pages;
      this.location = `/author/${this.author.author}`;
    } else {
      this.error = true;
    }
  }
}
