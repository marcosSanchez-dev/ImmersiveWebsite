import Button from "classes/Button";
import Page from "classes/Page";

export default class Detail extends Page {
  constructor() {
    super({
      id: "detail",
      element: ".detail",
      elements: {
        button: ".detail__button",
      },
    });

    // console.log("Detail Constructor");
  }
  create() {
    super.create();
    this.link = new Button({
      element: this.elements.button,
    });
  }

  destroy() {
    super.destroy();
    this.link.removeEventListeners();
  }
}
