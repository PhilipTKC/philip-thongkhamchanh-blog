import { bindable, ICustomElementViewModel } from "aurelia";

export interface ITraverse {
  nextTitle?: string;
  nextId?: string;
  previousTitle?: string;
  previousId?: string;
};

export class Traverse  implements ICustomElementViewModel {
  @bindable traverse: ITraverse;
}
