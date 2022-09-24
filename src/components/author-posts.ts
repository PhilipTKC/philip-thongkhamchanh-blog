import { bindable, ICustomElementViewModel } from "aurelia";

export class AuthorPosts implements ICustomElementViewModel {
  @bindable() authorPosts: any;
}
