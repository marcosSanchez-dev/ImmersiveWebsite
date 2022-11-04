import Page from "classes/Page";

export default class Collections extends Page {
  constructor() {
    super({
      id: "collections",
      element: ".collections",
    });

    // this.create(); Puedes acceder a los metodos de la clase Padre desde el hijo
    // console.log("Collections Constructor");
  }
}
