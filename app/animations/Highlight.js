import GSAP from "gsap";
import Animation from "classes/Animation";
import each from "lodash/each";
import { calculate, split } from "utils/text";

export default class Highlight extends Animation {
  constructor({ element, elements }) {
    super({ element, elements }); // el element que recibes en el constructor se los mandas al super
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({ delay: 0.5 });

    this.timelineIn.fromTo(
      this.element,
      { autoAlpha: 0, scale: 1.2 },
      { autoAlpha: 1, duration: 1.5, scale: 1, ease: "expo.out" }
    );
  }

  animateOut() {
    GSAP.set(this.element, { autoAlpha: 0 });
  }

  onResize() {}
}
