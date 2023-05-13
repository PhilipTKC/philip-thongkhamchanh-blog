import { IEventAggregator } from "aurelia";
import { IRouteableComponent, IRoute } from "@aurelia/router";

import { AnimationHooks } from "lifecycle-hooks/animation-hook";

import nProgress from "nprogress";


export class App implements IRouteableComponent {
  static dependencies = [AnimationHooks]

  static routes: IRoute[] = [
    {
      path: ['', ':page'],
      component: () => import('./pages/articles'),
      viewport: "main",
    },
    {
      path: [":date/:id"],
      component: () => import('./pages/post'),
      viewport: "main",
    },
    {
      path: ["author/:author", "author/:author/:page"],
      component: () => import('./pages/author'),
      viewport: "main",
    },
  ];

  constructor(@IEventAggregator readonly ea: IEventAggregator,) {
    this.subscribeRouterStart();
    this.subscribeRouterEnd();
  }

  /**
  * Subscribe to the router's navigation start event.
  */
  subscribeRouterStart() {
    this.ea.subscribe('au:router:navigation-start', () => {
      // Start the progress bar.
      nProgress.start();
    });
  }

  /**
  * Subscribe to the router's navigation end event.
  **/
  subscribeRouterEnd() {
    this.ea.subscribe('au:router:navigation-end', () => {
      // Complete the progress bar.
      nProgress.done();
      window.scrollTo(0, 0);
    });
  }
}
