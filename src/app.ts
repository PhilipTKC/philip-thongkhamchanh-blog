import { IRouter, IViewModel } from "aurelia";
import { hooks } from "router-hooks";
import { routes } from "routes";

import(/* webpackPrefetch: true */ "./css/output.css");
import(/* webpackPrefetch: true */ "./css/nprogress.css");

export class App implements IViewModel {
  private static routes = routes;

  constructor(@IRouter private router: IRouter) {}

  afterBind(): void {
    this.router.addHook(hooks.navigation.f);
    this.router.addHook(hooks.title.f, hooks.title.options);
  }
}
