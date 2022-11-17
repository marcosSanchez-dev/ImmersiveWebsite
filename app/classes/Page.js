import GSAP from "gsap";
import NormalizeWheel from "normalize-wheel";
import Prefix from "prefix";
import each from "lodash/each";
import map from "lodash/map";
import Title from "animations/Title";
import Paragraph from "animations/Paragraph";
import Label from "animations/Label";
import Highlight from "animations/Highlight";
export default class Page {
  constructor({ id, element, elements }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: "[data-animation='title']", // key | entry // selecciona por medio de querySelectorAll elementos con esta condicion
      animationsParagraphs: "[data-animation='paragraph']",
      animationsLabels: "[data-animation='label']",
      animationsHighlights: "[data-animation='highlight']",
    };
    this.id = id;
    this.transformPrefix = Prefix("transform");

    this.onMouseWheelEvent = this.onMouseWheel.bind(this);
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};
    this.scroll = { current: 0, target: 0, last: 0, limit: 0 };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();
  }

  createAnimations() {
    this.animations = [];

    //titles

    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({ element }); // creas instancias de la clase Title y le mando el elemento a animar, y que a su vez se propaga hacia los componentes padres por medio del super
    });

    this.animations.push(...this.animationsTitles);

    //paragraphs

    this.animationsParagraphs = map(
      this.elements.animationsParagraphs,
      (element) => {
        return new Paragraph({ element });
      }
    );
    this.animations.push(...this.animationsParagraphs);

    //Labels

    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({ element });
    });
    this.animations.push(...this.animationsLabels);

    //Higlights

    this.animationsHighlights = map(
      this.elements.animationsHighlights,
      (element) => {
        return new Highlight({ element });
      }
    );
    this.animations.push(...this.animationsHighlights);
  }

  show() {
    return new Promise((resolve) => {
      this.animationIn = GSAP.timeline();

      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );
      this.animationIn.call((_) => {
        this.addEventListeners();

        resolve(); //llamas a la callback function de tu new Promise y puedes pasarle un objeto para que resuelva un "value" (propiedad) https://jsitor.com/-9BkvFbbsO
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.removeEventListeners();

      this.animationOut = GSAP.timeline();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onMouseWheel(event) {
    const { pixelY } = NormalizeWheel(event); // pixelY es la cantida de scroll que haces, no tiene unidad solo se mide en numeros

    this.scroll.target += pixelY;
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }
    // console.log("this.animations: ", this.animations);
    each(this.animations, (animation) => animation.onResize());
  }

  update() {
    // console.log("target: ", this.scroll.target);
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.scroll.current < 0.01) {
      //este es un TIP ya que GSAP o el navegador no interpretan correctamente valores abajo de 0.01
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  addEventListeners() {
    window.addEventListener("wheel", this.onMouseWheelEvent);
  }

  removeEventListeners() {
    window.removeEventListener("wheel", this.onMouseWheelEvent);
  }
}
