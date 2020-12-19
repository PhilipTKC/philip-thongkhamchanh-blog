import { ICustomElementViewModel, IRouter } from "aurelia";
import { hooks } from "router-hooks";
import { routes } from "routes";

import "./css/output.css";
import "./css/nprogress.css";

export class App implements ICustomElementViewModel {
  private static routes = routes;

  private isDark: boolean;

  constructor(@IRouter private router: IRouter) { }

  async bound(): Promise<void> {
    this.setTheme();
    this.router.addHook(hooks.navigation.fn);
    this.router.addHook(hooks.title.fn, hooks.title.options);
  }

  async setTheme(): Promise<void> {
    const isDark = localStorage.getItem("isDark");

    if (isDark === "true") {
      this.isDark = true;
      this.loadDarkTheme();
    }
  }

  loadDarkTheme(): void {
    const headElement = document.getElementsByTagName("head")[0];
    let linkElement = document.createElement("link");

    linkElement.id = "dark";
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = "./dark.css";

    headElement.appendChild(linkElement);

    this.isDark = true;
    localStorage.setItem("isDark", "true");
  }

  removeDarkTheme(): void {
    const style = document.getElementById("dark");
    if (style !== null) {
      style.remove();
      this.isDark = false;
      localStorage.setItem("isDark", "false");
    }
  }
}
