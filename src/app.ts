import { ICustomElementViewModel, IRouterEvents, route } from "aurelia";

import nProgress from "nprogress";

const title = "Philip Thongkhamchanh Blog";

@route({
  routes: [
    {
      path: ["", "articles", "articles/:page"],
      component: "articles",
      viewport: "main",
      title: `${title} - Articles`,
    },
    { path: [":date/:id"], component: "post", viewport: "main" },
    {
      path: ["author/:author", "author/:author/:page"],
      component: "author",
      viewport: "main",
    },
  ],
})
export class App implements ICustomElementViewModel {
  constructor(@IRouterEvents readonly routerEvents: IRouterEvents) {
    this.subscribeToNavigationStartEvent();
    this.subscribeToNavigationEndEvent();
  }

  subscribeToNavigationStartEvent(): void {
    this.routerEvents.subscribe("au:router:navigation-start", () => {
      nProgress.start();
    });
  }

  subscribeToNavigationEndEvent(): void {
    this.routerEvents.subscribe("au:router:navigation-end", () => {
      window.scrollTo(0, 0);
      nProgress.done();
    });
  }
}
