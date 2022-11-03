export default class Page {
  constructor({ id, element, elements }) {
    // console.log("Page constructor");
    this.id = id;
    this.selector = element;
    this.selectorChildren = elements;
  }

  create() {
    this.element = document.querySelector(this.selector);

    console.log("Create Method in Page Class: ", this.id);
  }
}
