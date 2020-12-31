import { bindable, ICustomElementViewModel } from "aurelia";

export class PostFooter implements ICustomElementViewModel {
  @bindable avatar: string;

  @bindable author: string;

  @bindable date: string;

  @bindable length: string;

  @bindable name: string;
}
