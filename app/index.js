import each from "lodash/each";
import Canvas from "components/Canvas";
import Preloader from "components/Preloader";
import NormalizeWheel from "normalize-wheel";

import Navigation from "components/Navigation";
import About from "pages/About";
import Home from "pages/Home";
import Detail from "pages/Detail";
import Collections from "pages/Collections";

class App {
  constructor() {
    this.createContent();
    this.createPreloader();
    this.createNavigation();
    this.createCanvas();
    this.createPages();
    this.addEventListeners();
    this.addLinkListeners();
    this.update();
  }

  createNavigation() {
    this.navigation = new Navigation({ template: this.template });
  }

  createPreloader() {
    this.preloader = new Preloader();

    //se usa THIS para no apuntar al elemento PRELOADER sino al metodo de la clase APP
    this.preloader.once("completed", this.onPreloaded.bind(this)); //esta funcion pertence al EXTENDS "eventEmitter" de su padre "compontent"
  }

  createCanvas() {
    this.canvas = new Canvas();
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

      this.navigation.onChange(this.template);

      this.content.setAttribute("data-template", this.template);
      this.content.innerHTML = divContent.innerHTML; // reemplazas el innerHTML del ".content" original por la copia

      this.page = this.pages[this.template];
      this.page.create(); // entramos al hijo/nieto y llamamos la funcion del padre por medio de EXTENDS
      this.onResize();
      this.page.show();

      this.addLinkListeners();
    } else {
      console.log("error: ", error);
    }
  }

  onResize() {
    // if (this.canvas && this.canvas.onResize) {
    //   this.canvas.onResize();
    // }

    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    window.requestAnimationFrame((_) => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  onTouchDown(e) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(e);
    }
  }

  onTouchMove(e) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(e);
    }
  }

  onTouchUp(e) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(e);
    }
  }

  onWheel(e) {
    const normalizedWheel = NormalizeWheel(e);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
    }
  }

  addEventListeners() {
    window.addEventListener("mousewheel", this.onWheel.bind(this)); //utilizamos bind si queremos llamar un metodo dentro de otro metodo usando THIS

    window.addEventListener("mousedown", this.onTouchDown.bind(this)); // si no usamos BIND, el THIS se refiere al objeto window y no a nuestra classe App
    window.addEventListener("mousemove", this.onTouchMove.bind(this));
    window.addEventListener("mouseup", this.onTouchUp.bind(this));

    window.addEventListener("touchstart", this.onTouchDown.bind(this)); //llamas las mismas funciones para ser disparadas por medio de mouse o touchscreen
    window.addEventListener("touchmove", this.onTouchMove.bind(this));
    window.addEventListener("touchend", this.onTouchUp.bind(this));

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
    if (this.canvas && this.canvas.update) {
      this.canvas.update();
    }

    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }
}

new App();
