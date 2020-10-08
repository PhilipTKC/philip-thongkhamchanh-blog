import { IRouter, IViewModel } from "aurelia";
import { hooks } from "router-hooks";
import { routes } from "routes";

export class App implements IViewModel {
  private static routes = routes;

  private isDark: boolean;

  constructor(@IRouter private router: IRouter) {}

  async afterBind(): Promise<void> {
    this.router.addHook(hooks.navigation.f);
    this.router.addHook(hooks.title.f, hooks.title.options);

    await this.loadStyles();
  }

  async loadStyles(): Promise<void> {
    await import("./css/output.css");
    await import("./css/nprogress.css");

    const isDark = localStorage.getItem("isDark");

    if (isDark === "true") {
      this.isDark = true;
      this.loadDarkTheme();
    }
  }

  loadDarkTheme(): void {
    const headElement = document.getElementsByTagName("head")[0];
    const linkElement: HTMLLinkElement = document.createElement("link");
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
