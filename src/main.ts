import Aurelia from "aurelia";
import { RouterConfiguration } from "@aurelia/router";

import { App } from "./app";
import * as globalComponents from "./registry";

Aurelia.register(RouterConfiguration.customize({
  useUrlFragmentHash: false, title: {
    appTitle: "${componentTitles}${appTitleSeparator}Philip Thongkhamchanh Blog"
  },
}))
  .register(globalComponents)
  .app(App)
  .start();
