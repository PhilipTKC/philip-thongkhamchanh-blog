import Aurelia, { RouterConfiguration } from "aurelia";
import { App } from "./app";
import * as globalComponents from "./registry";

Aurelia.register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .register(globalComponents)
  .app(App)
  .start();
