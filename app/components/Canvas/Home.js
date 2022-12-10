import Media from "./Media";
import map from "lodash/map";
import { Plane, Transform } from "ogl";

export default class {
  constructor({ gl, scene, sizes }) {
    this.group = new Transform();
    this.gl = gl;
    this.sizes = sizes;
    this.mediasElements = document.querySelectorAll(
      ".home__gallery__media__image"
    );

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene); //aqui esta linkeando el transform dentro de index.js, a este nuevo transform
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  onResize(event) {
    map(this.medias, (media) => {
      media.onResize(event);
    });
  }
}
