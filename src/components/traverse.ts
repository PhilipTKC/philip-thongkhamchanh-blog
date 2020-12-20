import { bindable, ICustomElementViewModel } from "aurelia";

export type ITraverse = {
  nextTitle?: string;
  nextId?: string;
  previousTitle?: string;
  previousId?: string;
};

export class Traverse  implements ICustomElementViewModel {
  @bindable traverse: ITraverse;
}
