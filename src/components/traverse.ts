import { bindable } from "aurelia";

export type TraverseData = {
  nextTitle?: string;
  nextId?: string;
  previousTitle?: string;
  previousId?: string;
};

export class Traverse {
  @bindable traverseData: TraverseData;
}
