import { Mesh, Program, Texture } from "ogl";

import fragment from "shaders/plane-fragment.glsl";
import vertex from "shaders/plane-vertex.glsl";

export default class {
  constructor({ element, geometry, gl, index, scene, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.index = index;
    this.sizes = sizes;

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    this.texture = new Texture(this.gl);

    this.image = new window.Image();

    // necesitas especificar que el crossOrigin no hara intercambio de credenciales.
    // crossOrigin se trata de hacer peticiones de recursos a un servidor con un dominio diferente al del sitio actual
    this.image.crossOrigin = "anonymous";

    this.image.src = this.element.getAttribute("data-src");
    this.image.onload = (_) => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      // con el Program especificas las texturas y colores de la geometria , necesario para el MESH
      fragment,
      vertex,
      uniforms: {
        tMap: {
          value: this.texture,
        },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene); //agregas el MESH a la escena

    this.mesh.position.x += this.index * this.mesh.scale.x;
  }

  createBounds({ sizes }) {
    this.sizes = sizes;
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale(sizes);
    this.updateX();
    this.updateY();
  }

  updateScale({ height, width }) {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = width * this.width;
    this.mesh.scale.y = height * this.height;
  }

  updateX() {}

  updateY() {}

  onResize(sizes) {
    this.createBounds(sizes);
  }
}
