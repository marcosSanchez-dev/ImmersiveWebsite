import Component from "classes/Component";

export default class AsyncLoad extends Component {
  constructor({ element }) {
    super({ element });

    this.createObserver();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      // el IntersectionObserver te indica cuando un elemento es visible dentro del viewport
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("element:  ", this.element);
          console.log(
            "getAttribute('data-src'):  ",
            this.element.getAttribute("data-src")
          );
          this.element.src = this.element.getAttribute("data-src");
        }
      });
    });

    this.observer.observe(this.element);
  }
}
