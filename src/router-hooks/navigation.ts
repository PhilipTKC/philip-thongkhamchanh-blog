import { ViewportInstruction } from "aurelia";

export const hook = {
  f: async (instructions: ViewportInstruction[]): Promise<boolean> => {
    const nProgress = await import("nprogress").then(({ default: _ }) => _);
    nProgress.start();
    if (instructions.length === 0) {
      nProgress.done();
      return false;
    }
    return true;
  },
  options: {},
};
