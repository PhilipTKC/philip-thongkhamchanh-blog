import { IRouter, IViewModel, ViewportInstruction } from "aurelia";
import { HookTypes } from "@aurelia/router";

import(/* webpackPrefetch: true */ "./css/output.css");
import(/* webpackPrefetch: true */ "./css/nprogress.css");

export class App implements IViewModel {
  private readonly appName = "Philip Thongkhamchanh Blog";

  static routes = [
    { path: "blog", instructions: [{ component: "blog" }] },
    { path: "blog/:page", instructions: [{ component: "blog" }] },
    { path: "blog/:date/:id", instructions: [{ component: "post" }] },
    { path: "author/:author", instructions: [{ component: "author" }] },
    { path: "author/:author/:page", instructions: [{ component: "author" }] },
  ];

  constructor(@IRouter private router: IRouter) {}

  afterBind(): void {
    this.router.addHook(async (instructions: ViewportInstruction[]) => {
      const nProgress = await import("nprogress").then(({ default: _ }) => _);
      nProgress.start();
      if (instructions.length === 0) {
        nProgress.done();
        return false;
      }
      return true;
    });

    this.router.addHook(
      async (instructions: ViewportInstruction[]) => {
        if (instructions.length > 0 && typeof instructions === "object") {
          const instruct = instructions[0];
          const componentInstance = instruct.componentInstance;
          const componentType = instruct.componentType;
          if (componentType) {
            if (typeof componentType.title === "string") {
              return componentType.title;
            }

            if (componentType.title !== undefined) {
              const staticTitle = componentType.title(componentInstance, instruct);
              return `${staticTitle} | ${this.appName}`;
            }

            if (instruct.route && instruct.route.match.title) {
              return instruct.route.match.title;
            }

            return this.appName;
          }
        }
        return instructions;
      },
      {
        type: HookTypes.SetTitle,
      }
    );
  }
}
