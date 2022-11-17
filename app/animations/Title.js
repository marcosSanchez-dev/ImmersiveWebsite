import GSAP from "gsap";
import Animation from "classes/Animation";

import { calculate, split } from "utils/text";

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements }); // el element que recibes en el constructor se los mandas al super

    split({
      element: this.element,
    });

    split({
      element: this.element,
    });

    this.elementLines = document.querySelector("span span");
  }

  animateIn() {
    GSAP.fromTo(
      this.element, //elemento a animar
      { autoAlpha: 0 }, //objeto animacion FROM
      { autoAlpha: 1, duration: 1.5, delay: 0.5 } //objeto animacion TO
    );
  }

  animateOut() {
    GSAP.set(this.element, { autoAlpha: 0 });
  }
}
