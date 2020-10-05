import { bindable } from "aurelia";

export type ITraverse = {
  nextTitle?: string;
  nextId?: string;
  previousTitle?: string;
  previousId?: string;
};

export class Traverse {
  @bindable traverse: ITraverse;
}
