import Page from "classes/Page";

export default class About extends Page {
  //al hacer "extends Page" la clase About tiene acceso a todas las propiedades y metodos de la superclase "Page"
  constructor() {
    super({
      id: "about",
      element: ".about",
      elements: {
        title: ".about_title",
        wrapper: ".about__wrapper",
      },
    });
    // console.log("About Constructor");
  }
}
