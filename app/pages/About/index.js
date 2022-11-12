import Page from "classes/Page";

export default class About extends Page {
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
