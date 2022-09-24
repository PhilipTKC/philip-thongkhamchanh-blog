import { Parameters } from "@aurelia/router";
import { IRouteViewModel } from "aurelia";

export class Missing implements IRouteViewModel {
  private missingComponent: string;

  loading(parameters: Parameters): void {
    this.missingComponent = parameters.id as string;
  }
}
