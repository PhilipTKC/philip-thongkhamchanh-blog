import { IViewModel } from "aurelia";

import nProgress from "nprogress";

interface Parameters {
  id: string;
};

export class Missing implements IViewModel {
  private static parameters: string[] = ["id"];

  private static title = (instance: Missing) => `404 | ${instance.missingComponent} not found`;

  private missingComponent: string;

  load(parameters: Parameters): void {
    this.missingComponent = parameters.id;
  }

  async afterAttach(): Promise<void> {
    nProgress.done();
  }
}
