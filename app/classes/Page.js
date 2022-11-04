import GSAP from "gsap";
import each from "lodash/each";
export default class Page {
  constructor({ id, element, elements }) {
    // console.log("Page constructor");
    this.id = id;
    this.selector = element;
    this.selectorChildren = { ...elements };
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    console.log("this.selectorChildren: ", this.selectorChildren);

    each(this.selectorChildren, (entry, key) => {
      console.log("key: ", key, " entry: ", entry);

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

    console.log(
      "Current page id: ",
      this.id,
      " Current Page element: ",
      this.element
    );

    console.log("This.elements: ", this.elements);
  }

  show() {
    GSAP.from(this.element, {
      autoAlpha: 0,
      delay: 1,
    });
  }

  hide() {
    GSAP.to(this.element, {
      autoAlpha: 0,
    });
  }
}
