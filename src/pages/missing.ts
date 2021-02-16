import { IRouteViewModel, Params } from "@aurelia/router";

export class Missing implements IRouteViewModel {
  private missingComponent: string;

  load(parameters: Params): void {
    this.missingComponent = parameters.id;
  }
}
