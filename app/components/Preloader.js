import Component from "classes/Component";
import each from "lodash/each";

export default class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        images: document.querySelectorAll("img"),
      },
    });

    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      const image = new Image();

      image.onload = (_) => this.onAssetLoaded(image);
      image.src = element.getAttribute("data-src");

      // console.log(image);
    });
  }

  onAssetLoaded(image) {
    this.length++;

    console.log(Math.round((this.length / this.elements.images.length) * 100));
  }
}
