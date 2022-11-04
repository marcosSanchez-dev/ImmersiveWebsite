import Page from "classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        link: ".home__link",
        navigation: document.querySelector(".navigation"),
      },
    });

    // console.log("Home Constructor");
  }
}
