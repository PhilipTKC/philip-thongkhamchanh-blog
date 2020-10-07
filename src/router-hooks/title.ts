import { ViewportInstruction } from "aurelia";
import { HookTypes } from "@aurelia/router";

const appName = "Philip Thongkhamchanh Blog";

export const hook = {
  f: async (instructions: ViewportInstruction[]): Promise<string | ViewportInstruction[]> => {
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
          return `${staticTitle} | ${appName}`;
        }

        if (instruct.route && instruct.route.match.title) {
          return instruct.route.match.title;
        }

        return appName;
      }
    }
    return instructions;
  },
  options: {
    type: HookTypes.SetTitle,
  },
};
