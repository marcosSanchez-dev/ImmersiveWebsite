import { Mesh, Program, Texture } from "ogl";
import GSAP from "gsap";
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

    this.extra = {
      x: 0,
      y: 0,
    };

    this.createTexture();
    this.createProgram();
    this.createMesh();
    this.createBounds({
      sizes: this.sizes,
    });
  }

  createTexture() {
    this.texture = new Texture(this.gl);
    const image = this.element.querySelector("img");
    this.image = new window.Image();

    // necesitas especificar que el crossOrigin no hara intercambio de credenciales.
    // crossOrigin se trata de hacer peticiones de recursos a un servidor con un dominio diferente al del sitio actual
    this.image.crossOrigin = "anonymous";

    this.image.src = image.getAttribute("data-src");
    this.image.onload = (_) => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      // con el Program especificas las texturas y colores de la geometria , necesario para el MESH
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
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
    this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);

    // this.mesh.scale.x = 2;
  }

  createBounds({ sizes }) {
    this.sizes = sizes;
    this.bounds = this.element.getBoundingClientRect(); // devuele un DOMRect con la informacion del tamaño del elemento

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  show() {
    GSAP.fromTo(
      this.program.uniforms.uAlpha,
      {
        value: 0,
      },
      {
        value: 1,
      }
    );
  }

  hide() {
    GSAP.to(this.program.uniforms.uAlpha, {
      value: 0,
    });
  }

  onResize(sizes, scroll) {
    this.extra = 0;

    this.createBounds(sizes);
    this.updateX(scroll);
    this.updateY(0);
  }

  updateScale() {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = this.sizes.width * this.width; //multiplicas la formula predefinida (width) por la relacion que tienen el elemento con el viewport (this.width)
    this.mesh.scale.y = this.sizes.height * this.height;
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth;

    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      this.x * this.sizes.width +
      this.extra;
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight;

    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height;
  }

  update(scroll) {
    if (!this.bounds) return;
    this.updateX(scroll);
    this.updateY(0);
  }
}
