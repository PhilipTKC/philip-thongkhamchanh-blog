import { bindable, ICustomElementViewModel } from "aurelia";

export class PostContent implements ICustomElementViewModel {
  @bindable title: string;

  @bindable summary: string;

  @bindable id: string;
}
