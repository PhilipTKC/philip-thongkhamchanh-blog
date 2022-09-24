import { ICustomElementViewModel } from "aurelia";

export class ThemeChanger implements ICustomElementViewModel {
  private isDark: boolean;

  attached(): void {
    this.setTheme();
  }

  setTheme(): void {
    const isDark = localStorage.getItem("isDark");

    if (isDark === "true") {
      this.isDark = true;
      this.loadDarkTheme();
    }
  }

  loadDarkTheme(): void {
    const headElement = document.getElementsByTagName("head")[0];
    const linkElement = document.createElement("link");

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
