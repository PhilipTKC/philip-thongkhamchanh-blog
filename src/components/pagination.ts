import { bindable } from "aurelia";

export class Pagination {
  @bindable currentPage: number;

  @bindable loadTo: string;

  @bindable pages: number;
}
