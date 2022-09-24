import { Parameters } from "@aurelia/router";
import { IRouteViewModel, RouteNode } from "aurelia";

import { Author as IContributer, IAuthorService } from "services";

export class Author implements IRouteViewModel {
  private static title = (instance: RouteNode) =>
    `Author - ${instance.params.author}`;

  private currentPage = 1;

  private author: IContributer;

  private authorPosts: any;

  private error: boolean;

  private location: string;

  private pages: number;

  constructor(@IAuthorService private readonly authorService: IAuthorService) {}

  async loading(parameters: Parameters): Promise<void> {
    this.currentPage = Number(parameters.page as number) || 1;

    const author = await this.authorService.retrieveAuthor(
      parameters.author as string
    );

    if (author) {
      const { authorData, authorPosts } =
        await this.authorService.retrieveAuthorPosts(
          parameters.author as string,
          this.currentPage
        );
      this.author = author;
      this.authorPosts = authorPosts;
      this.pages = authorData.pages;
      this.location = `/author/${this.author.author}`;
    } else {
      this.error = true;
    }
  }
}
