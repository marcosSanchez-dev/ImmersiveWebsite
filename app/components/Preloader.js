import GSAP from "gsap";
import Component from "classes/Component";
import each from "lodash/each";
import { split } from "utils/text";
export default class Preloader extends Component {
  constructor() {
    super({
      //este super manda a llamar los metodos del Component antes de ejecutar los metodos del Preloader
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        numberText: ".preloader__number__text",
        images: document.querySelectorAll("img"),
      },
    });

    split({
      element: this.elements.title,
      expression: "<br>",
    });

    split({
      element: this.elements.title,
      expression: "<br>",
    });

    this.elements.titleSpans = this.elements.title.querySelector("span span");
    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      element.onload = (_) => this.onAssetLoaded(element); // mientra el metodo onload es resuelto, el codigo continua corriendo en las siguientes lineas
      element.src = element.getAttribute("data-src"); // el metodo onload aun no se resuelve pero todas las imagenes ya tienen source
    });
  }

  onAssetLoaded(image) {
    this.length += 1;

    const percent = this.length / this.elements.images.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;

    // console.log(Math.round((this.length / this.elements.images.length) * 100));

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = GSAP.timeline({ delay: 2 });

      this.animateOut.to(this.elements.titleSpans, {
        stagger: 0.1,
        duration: 1.5,
        ease: "expo.out",
        y: "100%",
      });

      this.animateOut.to(
        this.elements.numberText,
        {
          stagger: 0.1,
          duration: 1.5,
          ease: "expo.out",
          y: "100%",
        },
        "-=1.4"
      );

      this.animateOut.to(
        this.element,
        {
          scaleY: 0,
          duration: 1.5,
          ease: "expo.out",
          transformOrigin: "100% 100%",
        },
        "-=1"
      );

      this.animateOut.call((_) => {
        this.emit("completed");
      });
    });
  }

  destroy() {
    // this.element.parentNode.removeChild(this.element);
  }
}
