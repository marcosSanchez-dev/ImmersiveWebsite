import GSAP from "gsap";
import Animation from "classes/Animation";
import each from "lodash/each";
import { calculate, split } from "utils/text";

export default class Label extends Animation {
  constructor({ element, elements }) {
    super({ element, elements }); // el element que recibes en el constructor se los mandas al super

    split({
      element: this.element,
      append: true,
    });

    split({
      element: this.element, // separa en spams cada palabra del titutlo
      append: true,
    });

    this.elementLinesSpans = document.querySelectorAll("span span");
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({ delay: 0.5 });

    this.timelineIn.set(this.element, { autoAlpha: 1 });

    each(this.elementLines, (line, index) => {
      this.timelineIn.fromTo(
        line, //elemento a animar
        { y: "100%" }, //objeto animacion FROM
        // stagger sirve para correr una nueva animacion despues de haber terminado la actual
        { duration: 1.5, delay: index * 0.2, ease: "expo.out", y: "0%" }, // objeto animacion TO
        0
      );
    });
  }

  animateOut() {
    GSAP.set(this.element, { autoAlpha: 0 });
  }

  onResize() {
    this.elementLines = calculate(this.elementLinesSpans);
  }
}
