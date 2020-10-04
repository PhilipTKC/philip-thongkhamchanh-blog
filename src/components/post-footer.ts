import { bindable } from "aurelia";

export class PostFooter {
  @bindable avatar: string;

  @bindable author: string;

  @bindable date: string;

  @bindable length: string;

  @bindable name: string;
}
