import { bindable, ICustomElementViewModel } from "aurelia";

export class Pagination implements ICustomElementViewModel {
  @bindable() currentPage: number;

  @bindable() loadTo: string;

  @bindable() pages: number;
}
