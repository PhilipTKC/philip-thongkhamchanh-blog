import { IRouteableComponent, Parameters } from "@aurelia/router";

export class Missing implements IRouteableComponent {
  
  private missingComponent: string;

  loading(parameters: Parameters): void {
    this.missingComponent = parameters.id as string;
  }
}
