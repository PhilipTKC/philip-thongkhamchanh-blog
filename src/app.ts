import { IRouter } from "aurelia";
import { navigationHook, titleHook } from "router-hooks";
import { routes } from "routes";

import "./css/output.css";
import "./css/nprogress.css";

export class App {
  private static routes = routes;

  constructor(@IRouter private router: IRouter) { }

  attached(): void {
    this.router.addHook(navigationHook.fn);
    this.router.addHook(titleHook.fn, titleHook.options);
  }
}
