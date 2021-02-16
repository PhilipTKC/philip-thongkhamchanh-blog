import { IRouteViewModel, Params } from "@aurelia/router";

import nProgress from "nprogress";

export class Missing implements IRouteViewModel {
  private missingComponent: string;

  load(parameters: Params): void {
    this.missingComponent = parameters.id;
  }

  attached(): void {
    nProgress.done();
  }
}
