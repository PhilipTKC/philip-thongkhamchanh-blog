import { IRouterEvents } from "aurelia";
import { IRouteableComponent, IRoute } from "@aurelia/router";

import nProgress from "nprogress";

export class App implements IRouteableComponent {
  static routes: IRoute[] = [
    {
      path: [ '', ':page' ],
      component: () => import('./pages/articles'),
      viewport: "main",
    },
    {
      path: [ ":date/:id" ],
      component: () => import('./pages/post'),
      viewport: "main",
    },
    {
      path: ["author/:author", "author/:author/:page"],
      component: () => import('./pages/author'),
      viewport: "main",
    },
  ];

  constructor (@IRouterEvents readonly routerEvents: IRouterEvents) {
    this.subscribeToNavigationStartEvent();
    this.subscribeToNavigationEndEvent();
  }

  subscribeToNavigationStartEvent (): void {
    this.routerEvents.subscribe("au:router:navigation-start", () => {
      nProgress.start();
    });
  }

  subscribeToNavigationEndEvent (): void {
    this.routerEvents.subscribe("au:router:navigation-end", () => {
      window.scrollTo(0, 0);
      nProgress.done();
    });
  }
}
