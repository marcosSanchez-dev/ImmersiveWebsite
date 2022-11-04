import each from "lodash/each";

import About from "./pages/About";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Collections from "./pages/Collections";

class App {
  constructor() {
    this.createContent();
    this.createPages();
    this.addLinkListeners();
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
    this.page.create(); // entramos al hijo/nieto y llamamos la funcion del padre por medio de EXTENDS
    this.page.show();
  }

  onChange(url) {
    const request = window.fetch(url);

    console.log("request: ", request);
  }

  addLinkListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      link.onclick = (event) => {
        const { href } = link;

        event.preventDefault();
        this.onChange(href);
      };
    });
  }
}

new App();
