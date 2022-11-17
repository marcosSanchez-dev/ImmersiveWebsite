import Component from "classes/Component";

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({ element, elements });

    this.createObserver();

    this.animateOut();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      // el IntersectionObserver te indica cuando un elemento es visible dentro del viewport
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // console.log("animateIN");
          this.animateIn();
        } else {
          // console.log("animateOUT");
          this.animateOut();
        }
      });
    });

    this.observer.observe(this.element);
  }

  animateIn() {}

  animateOut() {}
}
