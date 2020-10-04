import { AuthorService, Contributor as IContributer } from "services";
import { inject, IViewModel } from "aurelia";

type Parameters = {
  authorId: string;
  page: string;
};

@inject(AuthorService)
export class Author implements IViewModel {
  private static parameters: string[] = ["authorId", "page"];

  private static title = (instance: Author) =>
    `${instance.author !== undefined ? instance.author.authorId : "Not Found"} | Contributor`;

  private author: IContributer;

  private authorPosts: any;

  private currentPage = 1;

  private error: boolean;

  private location: string;

  private pages: number;

  constructor(private readonly authorService: AuthorService) {}

  async load(parameters: Parameters): Promise<void> {
    this.currentPage = Number(parameters.page) || 1;

    const author = await this.authorService.retrieveContributor(parameters.authorId);

    if (author) {
      const { authorData, authorPosts } = await this.authorService.retrieveContributorsPosts(parameters.authorId, this.currentPage);
      this.author = author;
      this.authorPosts = authorPosts;
      this.pages = authorData.pages;
      this.location = `/author/${this.author.authorId}`;
    } else {
      this.error = true;
    }
  }

  afterAttach(): void {
    window.scrollTo(0, 0);
    import("nprogress").then(({ default: _ }) => _.done());
  }
}
