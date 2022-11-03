import About from "./pages/About";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Collections from "./pages/Collections";

class App {
  constructor() {
    this.createContent();
    this.createPages();
  }

  createContent() {
    this.content = document.querySelector(".content");
    // console.log(this.content);
    this.template = this.content.getAttribute("data-template");
    // console.log(this.template);
  }

  createPages() {
    this.pages = {
      home: new Home(),
      detail: new Detail(),
      collections: new Collections(),
      about: new About(),
    };

    this.page = this.pages[this.template];
    this.page.create();

    // console.log("this.template: ", this.template);
    // console.log("this.page: ", this.page);
  }
}

new App();
