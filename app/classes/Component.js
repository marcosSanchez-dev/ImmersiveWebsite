import EventEmitter from "events";
import each from "lodash/each";

export default class Component extends EventEmitter {
  constructor({ element, elements }) {
    super(); // Cualquier class que sea extends de COMPONENT, tiene por default los metodos de EventEmitter por este keyword SUPER

    this.selector = element; // selector porque es el querySELECTOR para obtener el elemento del DOM
    this.selectorChildren = { ...elements };

    this.create();
    this.addEventListeners();
  }

  create() {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector; // creo una nueva variable llamada ELEMENT y le asigno el valor de SELECTOR
    } else {
      this.element = document.querySelector(this.selector);
    }
    this.elements = {}; // inicializo esta variable con un OBJ vacio

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry) //verifico si "entry" es un array por medio del objeto Array
      ) {
        //el objeto ELEMENTS tendra solo aquellos elementos que cumplan las condiciones y el acomodo de los valores es igual a this.selectorChildren
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry); // querySelectorAll siempre trae de vuelta un NODEList con el numero (length) de elementos encontrados

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });
  }

  addEventListeners() {}

  removeEventListeners() {}
}
