import { lifecycleHooks } from 'aurelia';

import anime from 'animejs';

const animateIn = (element: HTMLElement) =>
  anime({
    targets: element,
    opacity: [0, 1],
    duration: 250,
    easing: 'easeInOutSine',
  });

const animateOut = (element: HTMLElement) =>
  anime({
    targets: element,
    opacity: [1, 0],
    duration: 250,
    easing: 'easeInOutSine',
  });

@lifecycleHooks()
export class AnimationHooks {
  private element: HTMLElement;

  created(vm, controller): void {
    this.element = controller.host;
  }

  attaching() {
    animateIn(this.element);
  }

  detaching() {
    animateOut(this.element);
  }
}
