import { ViewportInstruction } from "aurelia";
import nProgress from "nprogress";

export const hook = {
  fn: async (instructions: ViewportInstruction[]): Promise<boolean> => {
    nProgress.start();
    if (instructions.length === 0) {
      nProgress.done();
      return false;
    }
    return true;
  },
  options: {},
};
