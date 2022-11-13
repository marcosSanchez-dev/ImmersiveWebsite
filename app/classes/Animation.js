import Component from "classes/component";

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({ element, elements });
    this.createObserver();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("animateIN");
        } else {
          console.log("animateOUT");
        }
      });
    });

    this.observer.observe(this.element);
  }
}
