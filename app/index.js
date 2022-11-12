import each from "lodash/each";
import Preloader from "components/Preloader";

import About from "pages/About";
import Home from "pages/Home";
import Detail from "pages/Detail";
import Collections from "pages/Collections";

class App {
  constructor() {
    this.createPreloader();
    this.createContent();
    this.createPages();
    this.addEventListeners();
    this.addLinkListeners();
    this.update();
  }

  createPreloader() {
    this.preloader = new Preloader();
    //se usa THIS para no apuntar al elemento PRELOADER sino al metodo de la clase APP
    this.preloader.once("completed", this.onPreloaded.bind(this)); //esta funcion pertence al EXTENDS "eventEmitter" de su padre "compontent"
  }

  onPreloaded() {
    this.preloader.destroy();
    this.onResize();
    this.page.show();
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
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
    this.onResize();
  }

  async onChange(url) {
    await this.page.hide();

    const request = await window.fetch(url); //mandamos a llamar el contenido de una página sin que nos redirija a ella

    if (request.status === 200) {
      const html = await request.text(); //traes tu request en formato Texto
      const div = document.createElement("div"); //al ser creado, este DIV no esta en el body del documento

      div.innerHTML = html; //crear una copia del HTML en este DIV que sería como un nuevo "document."

      const divContent = div.querySelector(".content"); //seleccionas el elemento .content dentro de este nuevo "document" llamado "div"

      this.template = divContent.getAttribute("data-template");

      this.content.setAttribute("data-template", this.template);
      this.content.innerHTML = divContent.innerHTML; // reemplazas el innerHTML del ".content" original por la copia

      this.page = this.pages[this.template];
      this.page.create(); // entramos al hijo/nieto y llamamos la funcion del padre por medio de EXTENDS
      this.page.show();

      this.addLinkListeners();
    } else {
      console.log("error: ", error);
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
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

  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }
}

new App();
